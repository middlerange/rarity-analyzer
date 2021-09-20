import * as React from "react";
import { CaratBackIcon, SkipFirstIcon } from "../Icons";

const Pagination = ({
	totalCount,
	filter,
	setFilter,
}: {
	totalCount: any;
	filter: any;
	setFilter: any;
}) => {
	const lastPage = Math.round(totalCount / 20);
	const pageMenuSize = lastPage > 7 ? 7 : lastPage;

	const activePages = React.useMemo(
		() =>
			filter.page > lastPage - pageMenuSize
				? Array.from(
						Array(pageMenuSize),
						(_, i) => lastPage + (i - (pageMenuSize - 1))
				  )
				: filter.page > pageMenuSize
				? Array.from(Array(pageMenuSize), (_, i) => filter.page + i)
				: Array.from(Array(pageMenuSize), (_, i) => i + 1),
		[filter.page, lastPage]
	);

	return (
		<div className="max-w-screen-xl mx-auto w-full flex items-center justify-center mt-20 mb-4 overflow-x-auto">
			<div className="pagination">
				<ul className="flex align-center justify-center">
					<li
						className={`relative block py-2 px-3 leading-tight bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 rounded cursor-pointer ml-2`}
						onClick={() => setFilter({ ...filter, page: 1 })}
					>
						<span className="page-link">
							<SkipFirstIcon />
						</span>
					</li>
					<li
						className="relative block py-2 px-1 leading-tight bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 rounded cursor-pointer ml-2"
						onClick={() => {
							if (filter.page !== 1) {
								setFilter({
									...filter,
									page: filter.page - 1,
								});
							}
						}}
					>
						<span className="page-link">
							<CaratBackIcon />
						</span>
					</li>
					{activePages.map((page) => (
						<li
							key={`page-${page}`}
							className={`w-10 al relative block py-2 px-1 leading-tight bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500 rounded cursor-pointer ml-2 flex items-center ${
								filter.page === page
									? "bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-700 text-white hover:bg-blue-700"
									: ""
							} `}
							onClick={() => setFilter({ ...filter, page })}
						>
							<span className="block page-link w-full text-center">{page}</span>
						</li>
					))}
					<li
						className="relative block py-2 px-1 leading-tight bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 rounded cursor-pointer ml-2 rotate-180"
						onClick={() => {
							if (filter.page !== lastPage) {
								setFilter({
									...filter,
									page: filter.page + 1,
								});
							}
						}}
					>
						<span className="page-link">
							<CaratBackIcon />
						</span>
					</li>

					<li
						className={`relative block py-2 px-3 leading-tight bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 rounded cursor-pointer ml-2 rotate-180`}
						onClick={() => setFilter({ ...filter, page: lastPage })}
					>
						<span className="page-link ">
							<SkipFirstIcon />
						</span>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Pagination;
