import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import NavBar from "../components/NavBar";
import { bladeRunner } from "../fonts";
import Link from "next/link";

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
      <footer className="text-center py-4 bg-stone-100">
        Por favor, lee nuestra{" "}
        <Link
          href="politicas"
          className="text-bc-purple-2 hover:text-bc-purple-1"
        >
          política de privacidad!
        </Link>
      </footer>
    </SessionProvider>
  );
}
