import * as React from "react";
import { useTheme } from "next-themes";

const DarkModeToggle = () => {
	const [mounted, setMounted] = React.useState(false);
	const { theme, setTheme } = useTheme();
	React.useEffect(() => setMounted(true), []);
	const handleClick = () => {
		const nextTheme = theme === "dark" ? "light" : "dark";
		setTheme(nextTheme);
	};
	return (
		<div className="flex justify-between items-center">
			{/* <h2 className="ml-2 mr-3">{theme === "dark" ? "Dark" : "Light"} Mode</h2> */}
			<div
				className=" ml-3 w-16 h-10 bg-gray-300 dark:bg-gray-1000 rounded-full flex-shrink-0 p-1"
				onClick={handleClick}
				aria-label="Toggle Dark Mode"
				role="button"
			>
				<div
					className={`bg-white w-8 h-8 rounded-full shadow-md duration-300 ease-in-out flex items-center justify-center dark:bg-gray-800 ${
						mounted && (theme === "dark" ? "translate-x-6" : "")
					}`}
				>
					{mounted && (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							stroke="currentColor"
							className="h-4 w-4 text-gray-400 dark:text-gray-200"
						>
							{theme === "dark" ? (
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
								/>
							) : (
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
								/>
							)}
						</svg>
					)}
				</div>
			</div>
		</div>
	);
};

export default DarkModeToggle;
