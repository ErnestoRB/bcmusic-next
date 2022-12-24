import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import NavBar from "../components/NavBar";
import { bladeRunner } from "../fonts";

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
        Aplicación creada por{" "}
        <span className="text-bc-pink-1">Ernesto Ramírez</span>. Banner creado
        por <span className="text-bc-purple-1">Iker Jiménez</span>.
        <p>Con datos de la API de Spotify.</p>
      </footer>
    </SessionProvider>
  );
}
