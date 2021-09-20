var fs = require("fs");

const getRarityScore = (count, total) => {
	return Math.round((1 / (count / total)) * 1e4) / 1e4;
};

const computeRarity = (collection) => {
	const traits = {};
	const traitTypes = {};
	const traitCount = {};
	const rarity = [];

	collection.map((token, index) => {
		token.id = token.id ? token.id : index;
		if (token.attributes) {
			const totatAttributes = token.attributes.filter(
				(attribute) => attribute.trait_type
			).length;
			traitCount[totatAttributes] = traitCount[totatAttributes]
				? traitCount[totatAttributes] + 1
				: 1;
			token.attributes
				.filter((attribute) => attribute.trait_type)
				.map((attribute) => {
					if (attribute.trait_type) {
						traitTypes[attribute.trait_type] = {
							count:
								traitTypes[attribute.trait_type] &&
								traitTypes[attribute.trait_type].count
									? traitTypes[attribute.trait_type].count + 1
									: 1,
						};
						traits[attribute.trait_type] = {
							...(traits[attribute.trait_type] || {}),
							[attribute.value]: {
								count:
									traits[attribute.trait_type] &&
									traits[attribute.trait_type][attribute.value]
										? traits[attribute.trait_type][attribute.value].count + 1
										: 1,
							},
						};
					}
				});
		}
	});

	Object.keys(traits).map((trait) => {
		Object.keys(traits[trait]).map((traitValue) => {
			traits[trait][traitValue] = {
				...traits[trait][traitValue],
				rarity_score: getRarityScore(
					traits[trait][traitValue].count,
					collection.length
				),
				percentile: traits[trait][traitValue].count / collection.length,
			};
		});
	});

	Object.keys(traitTypes).map((traitType) => {
		traitTypes[traitType] = {
			...traitTypes[traitType],
			rarity_score: getRarityScore(
				traitTypes[traitType].count,
				collection.length
			),
			percentile: traitTypes[traitType].count / collection.length,
		};
	});

	collection.map((token) => {
		if (token.attributes) {
			const attributesWithRarity = token.attributes
				.map((attribute) => {
					return {
						...attribute,
						percentile: attribute.trait_type
							? traits[attribute.trait_type][attribute.value].count /
							  collection.length
							: null,
						rarity_score: traits[attribute.trait_type]
							? getRarityScore(
									traits[attribute.trait_type][attribute.value].count,
									collection.length
							  )
							: null,
					};
				})
				.filter((attribute) => attribute.trait_type);
			const traitCountWithRarity = {
				count: token.attributes.filter((attribute) => attribute.trait_type)
					.length,
				rarity_score: getRarityScore(
					traitCount[
						token.attributes.filter((attribute) => attribute.trait_type).length
					],
					collection.length
				),
				percentile:
					traitCount[
						token.attributes.filter((attribute) => attribute.trait_type).length
					] / collection.length,
			};
			const missingTraitsWithRarity = Object.keys(traits)
				.filter((trait) => {
					return !token.attributes.find(
						(attribute) => attribute.trait_type === trait
					);
				})
				.map((missingTraitKey) => ({
					trait_type: missingTraitKey,
					...traitTypes[missingTraitKey],
					rarity_score: getRarityScore(
						collection.length - traitTypes[missingTraitKey].count,
						collection.length
					),
				}));

			rarity[token.id] = {
				...token,
				attributes: attributesWithRarity,
				missing_traits: missingTraitsWithRarity,
				trait_count: traitCountWithRarity,
				rarity_score:
					attributesWithRarity.reduce((a, b) => a + b.rarity_score, 0) +
					missingTraitsWithRarity.reduce((a, b) => a + b.rarity_score, 0) +
					traitCountWithRarity.rarity_score,
			};
		}
	});

	const ranked = Object.keys(rarity).sort(function (a, b) {
		return rarity[b].rarity_score - rarity[a].rarity_score;
	});

	ranked.forEach((node, index) => {
		rarity[node] = {
			...rarity[node],
			rank: index + 1,
		};
	});

	return {
		traits,
		traitCount,
		rarity,
		ranked,
		meta: {
			totalCount: collection.length,
		},
	};
};

fs.readFile("data/collection.json", "utf8", function (err, data) {
	if (err) throw err;
	const collection = JSON.parse(data);
	const traits = computeRarity(collection);
	saveData(traits);
});

function saveData(data) {
	fs.writeFileSync("data/rarity.json", JSON.stringify(data, null, 4));
}
