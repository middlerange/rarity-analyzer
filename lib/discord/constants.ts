import { RESTOptions } from "./rest";
// @ts-ignore
export const DefaultUserAgent = `DiscordBot (https://github.com/discordjs/discord.js-modules/tree/main/packages/rest, 0.1.1-canary.0)`;

export const DefaultRestOptions: Required<RESTOptions> = {
	api: "https://discord.com/api",
	offset: 50,
	retries: 3,
	timeout: 15_000,
	userAgentAppendix: `Node.js ${process.version}`,
	version: "9",
};

/**
 * Parsed route data for an endpoint
 *
 * @internal
 */
export interface RouteData {
	majorParameter: string;
	bucketRoute: string;
	original: string;
}
