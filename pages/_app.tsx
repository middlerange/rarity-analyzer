import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider attribute="class">
			<>
				<Header />
				<Component {...pageProps} />
				<Footer />
			</>
		</ThemeProvider>
	);
}
export default MyApp;
