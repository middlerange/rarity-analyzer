import * as React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
	render() {
		return (
			<Html lang="en">
				<Head>
					<link rel="shortcut icon" href="/favicon.ico" />
					{/* <script async src="/ahoy.js" /> */}
					<script
						async
						src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_SITE_ID}`}
					/>
				</Head>
				<body className="dark:bg-gray-900 bg-white dark:text-gray-200 text-black">
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
