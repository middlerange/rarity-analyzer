import { REST } from '../../lib/discord/rest';
import { Routes } from 'discord-api-types/v9';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  InteractionResponseType,
  InteractionType,
  verifyKey
} from 'discord-interactions';
import { rarityStore } from '../../helpers/rarity';
import { capitalizeFirstLetter } from '../../utils/string';
import { getTokenImageLink } from '../../utils/image';

const { APPLICATION_ID, TOKEN, NEXT_PUBLIC_SITENAME }: any = process.env;

const commands = [
  {
    name: 'rarity',
    description: `Rarity for ${NEXT_PUBLIC_SITENAME}`,
    options: [
      {
        name: 'token',
        description: 'Enter Token ID',
        type: 4,
        required: true
      }
    ]
  }
];

const rest = new REST({ version: '9' }).setToken(TOKEN);

const webhookPayloadParser = (req: NextApiRequest) =>
  new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      resolve(Buffer.from(data).toString());
    });
  });

async function registerCommands(guildId?: any) {
  try {
    console.log(
      `Started refreshing application (/) commands ${
        guildId && `for ${guildId}`
      }.`
    );

    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(APPLICATION_ID, guildId), {
        body: commands
      });
    } else {
      await rest.put(Routes.applicationCommands(APPLICATION_ID), {
        body: commands
      });
    }

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<any>
) {
  if (request.method === 'POST') {
    const { PUBLIC_KEY, GUILD_ID }: any = process.env;
    const signature: any = request.headers['x-signature-ed25519'];
    const timestamp: any = request.headers['x-signature-timestamp'];
    const rawBody: any = await webhookPayloadParser(request);

    const isValidRequest = verifyKey(rawBody, signature, timestamp, PUBLIC_KEY);

    const message = JSON.parse(rawBody);

    if (!isValidRequest) {
      return response.status(400).json({ error: 'Bad request signature ' });
    }

    if (message.type === InteractionType.PING) {
      console.log('Ping');
      registerCommands(request.query.guildId || GUILD_ID);
      return response.status(200).json({ type: InteractionResponseType.PONG });
    }

    if (message.type === InteractionType.APPLICATION_COMMAND) {
      switch (message.data.name.toLowerCase()) {
        case 'rarity':
          const rarity = rarityStore.getById(message.data.options[0].value);
          const meta = rarityStore.getMeta();
          if (!rarity) {
            return response.status(400).send({});
          }
          console.log('r', rarity.id);
          const allAttributes = [
            ...rarity.attributes,
            ...rarity.missing_traits
          ];
          return response.status(200).send({
            type: 4,
            data: {
              content: rarity
                ? `**${NEXT_PUBLIC_SITENAME} ${
                    process.env.NEXT_PUBLIC_COLLECTION_TOKEN
                      ? `[#${rarity.id}](https://opensea.io/${process.env.NEXT_PUBLIC_COLLECTION_TOKEN}/${rarity.id} "Opensea link")`
                      : `#${rarity.id}`
                  }**
------------------------------
Rank: **${rarity.rank}** (out of ${meta.totalCount})
------------------------------
Rarity Score: **${Math.floor(rarity.rarity_score * 1e4) / 1e4}** (based on ${
                    allAttributes.length
                  } attributes)
${allAttributes
  .map(
    (trait: any) =>
      `
**${capitalizeFirstLetter(trait.trait_type)}**
${trait.value || '<none>'}    (${trait.rarity_score})\n`
  )
  .join('')}

	[](${getTokenImageLink(rarity.image)})
`
                : null
            }
          });
          break;
        default:
          console.error('Unknown Command');
          return response.status(400).send({ error: 'Unknown Type' });
          break;
      }
    } else {
      return response.status(400).json({ error: 'Unknown Type' });
    }
  }
  return response.status(404).send({});
}

export const config = {
  api: {
    bodyParser: false
  }
};
