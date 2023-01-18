import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import NavBar from "../components/NavBar";
import { bladeRunner } from "../fonts";
import { Footer } from "../components/Footer";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <div className={`flex flex-col min-h-screen ${bladeRunner.variable}`}>
        <NavBar></NavBar>
        <div className="relative flex h-full flex-1">
          <Component {...pageProps}></Component>
        </div>
      </div>
      <Footer></Footer>
    </SessionProvider>
  );
}
