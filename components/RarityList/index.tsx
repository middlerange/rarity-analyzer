import { useRouter } from "next/router";
import * as React from "react";
import { rarityStore } from "../../helpers/rarity";

import { CloseIcon, MinusIcon, SearchIcon } from "../Icons";
import TokenCard from "../Token/TokenCard";
import Pagination from "./Pagination";

export const PAGE_LIMIT = 20;

const RarityList = ({
	tokens,
	setTokens,
	count,
	meta,
	traits,
}: {
	tokens: any;
	count: any;
	meta: any;
	traits: any;
	setTokens: any;
}) => {
	const router = useRouter();
	const [filter, setFilter] = React.useState<any>({
		page: 1,
		traitCount: [],
		traits: [],
		sortBy: router.query.sortBy || "id",
	});
	const [tokenId, setTokenId] = React.useState("");
	const [filterAccordion, setFilterAccordion] = React.useState<any>({});

	const changeSort = (sortBy: string) => {
		router.push(`/?sortBy=${sortBy}`, `/?sortBy=${sortBy}`);
	};

	const openToken = () => {
		router.push(`/?viewId=${tokenId}`, `/view/${tokenId}`);
	};

	React.useEffect(() => {
		const sortBy = router.query.sortBy || "id";
		if (filter.sortBy !== sortBy) {
			setFilter({
				...filter,
				page: 1,
				sortBy,
			});
		}
	}, [router.query.sortBy]);

	React.useEffect(() => {
		getPage();
	}, [filter]);

	const getPage = () => {
		const updatedTokens = rarityStore.getPage({
			limit: PAGE_LIMIT,
			offset: (filter.page - 1) * PAGE_LIMIT,
			sortBy: filter.sortBy,
			traits: filter.traits,
			traitCount: filter.traitCount,
		});
		setTokens(updatedTokens);
	};

	return (
		<div className=" xl:px-0 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-10 pt-4 content-start items-start relative">
			<div
				className="md:w-72 flex-col space-y-4 w-full hidden lg:flex dark:bg-gray-900 py-4 rounded-md"
				style={{ width: "320px" }}
			>
				<h3 className="font-semibold ml-1 mb-1 pb-4 border-b border-gray-200 dark:border-gray-700 ">
					Filters
				</h3>
				<div className="flex content-center items-end justify-between space-x-2">
					<div className="w-full rounded-full bg-opacity-50 mt-1">
						{/* <label className="text-md font-medium text-gray-600 tracking-tight leading-tighter mt-4 mb-2 block">
							Token
						</label> */}
						<div className="relative rounded-md shadow-sm">
							<input
								type="text"
								placeholder="Search ID"
								value={tokenId}
								onKeyUp={(e: any) => e.key === "Enter" && openToken()}
								onChange={(e) => setTokenId(e.target.value)}
								className="block w-full p-2 border border-gray-200 rounded form-input sm:text-sm sm:leading-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-300 dark:border-gray-600"
							/>
						</div>
					</div>
					<button
						type="button"
						onClick={openToken}
						className="flex content-center items-center justify-center text-center px-4 py-2 border border-gray-200 shadow-sm text-sm font-medium rounded-md text-gray-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:text-gray-300 dark:bg-gray-600 dark:border-gray-500"
					>
						<SearchIcon />
					</button>
				</div>
				<div>
					<label className="block mt-5 mb-3 ml-2 font-semibold">
						Attributes count
					</label>
					<nav className="flex-1  space-y-0.5 mt-2 hidden md:flex md:flex-col">
						{Object.keys(count).map((key) => (
							<a
								key={`count-${key}`}
								className="flex items-center content-center justify-between block hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700 px-1 py-2 rounded-md transition ease-in-out duration-150 font-normal"
								onClick={() =>
									setFilter({
										...filter,
										traitCount:
											filter.traitCount.indexOf(Number(key)) > -1
												? filter.traitCount.filter(
														(k: number) => k !== Number(key)
												  )
												: [...filter.traitCount, Number(key)],
									})
								}
							>
								<span className="flex my-2 items-center title text-sm">
									<input
										type="checkbox"
										className="form-tick dark:text-blue-600 appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-600 checked:border-transparent focus:outline-none"
										checked={filter.traitCount.find(
											(k: number) => k === Number(key)
										)}
									/>
									<span className="dark:text-gray-200 text-gray-700 ml-3">
										{key}
									</span>
								</span>

								<span className="text-xs text-gray-500 px-2 py-0.5 rounded-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-300 dark:border-gray-600">
									{count[key]}
								</span>
							</a>
						))}
					</nav>
				</div>
				<div>
					<label className="block mt-5 mb-3 ml-2 font-semibold">
						Attributes
					</label>
					<nav className="flex-1 mt-2 hidden md:flex md:flex-col">
						{Object.keys(traits).map((key) => (
							<div key={`traits-${key}`}>
								<div
									className={`flex items-center content-center justify-between block hover:bg-gray-50 cursor-pointer dark:hover:bg-gray-900 px-2 py-2 rounded-md transition ease-in-out duration-150 font-normal border border-r-0 border-l-0 border-gray-100 dark:border-gray-600 bg-transparent dark:bg-gray-800
										${filterAccordion[key] ? "border-b-0" : ""}
									`}
									onClick={() =>
										setFilterAccordion({
											...filterAccordion,
											[key]: !filterAccordion[key],
										})
									}
								>
									<span className="capitalize title pl-2 py-2">{key}</span>
									<span
										className={`text-xs text-gray-500 px-2 py-0.5 text-gray-900 dark:text-gray-300 dark:border-gray-600`}
									>
										{filterAccordion[key] ? (
											<span className="rotate-45 block">
												<CloseIcon />
											</span>
										) : (
											<MinusIcon />
										)}
									</span>
								</div>
								{!filterAccordion[key] && (
									<div className="border-box">
										{Object.keys(traits[key]).map((valueKey) => (
											<a
												key={`traitvalue-${valueKey}`}
												className="pl-2 mx-1 flex items-center content-center justify-between block hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700 px-2 py-2 rounded-md transition ease-in-out duration-150 font-normal"
												onClick={() =>
													setFilter({
														...filter,
														traits:
															filter.traits.indexOf(valueKey) > -1
																? filter.traits.filter(
																		(k: string) => k !== valueKey
																  )
																: [...filter.traits, valueKey],
													})
												}
											>
												<span className="flex my-2 items-center title text-sm pl-2">
													<input
														type="checkbox"
														className="form-tick dark:text-blue-600 appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-600 checked:border-transparent focus:outline-none"
														checked={filter.traits.find(
															(k: string) => k === valueKey
														)}
													/>
													<span className="dark:text-gray-200 text-gray-700 ml-3">
														{valueKey}
													</span>
												</span>
												<span className="text-xs font-medium text-gray-500 px-2 py-0.5 rounded-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-300 dark:border-gray-600">
													{traits[key][valueKey].count}
												</span>
											</a>
										))}
									</div>
								)}
							</div>
						))}
					</nav>
				</div>
			</div>
			<div className="w-full">
				<div className="">
					<div className="flex justify-between items-end pb-4 mb-6 border-b border-gray-200 dark:border-gray-700 max-w-screen-xl mx-auto">
						<div>
							<h3 className="font-semibold ml-2">
								{meta.totalCount} Total {process.env.NEXT_PUBLIC_SITENAME}
							</h3>
						</div>
						<div className="flex space-x-2 items-center">
							<div className="font-bold w-32">Sort by:</div>
							<div className="relative inline-block w-full text-gray-700 dark:text-gray-200 sortBy">
								<select
									className="w-full h-10 pl-3 pr-6 text-base placeholder-current border rounded-lg dark:bg-gray-900 appearance-none focus:shadow-outline dark:border-gray-700"
									value={filter.sortBy}
									onChange={(e) => changeSort(e.target.value)}
								>
									<option className="sortBy-option" value="id">
										ID
									</option>
									<option className="sortBy-option" value="rarity">
										Rarity
									</option>
								</select>
								<div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
									<svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
										<path
											d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
											clipRule="evenodd"
											fillRule="evenodd"
										></path>
									</svg>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
					{tokens.data &&
						tokens.data.map((token: any) => (
							<TokenCard key={token.id} token={token} />
						))}
				</div>

				<Pagination
					totalCount={tokens.total}
					setFilter={setFilter}
					filter={filter}
				/>
			</div>
		</div>
	);
};

export default RarityList;
