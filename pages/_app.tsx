import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import NavBar from "../components/NavBar";
import { bladeRunner } from "../fonts";
import { Footer } from "../components/Footer";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { BackgroundContext } from "../context/BackgroundContext";
import { backgroundGradient } from "../utils/styles";
import { useState } from "react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [background, setBackground] = useState(backgroundGradient);

  return (
    <SessionProvider session={session}>
      <BackgroundContext.Provider
        value={{
          background,
          setBackground,
          setDefault: () => setBackground(backgroundGradient),
        }}
      >
        <div
          className={`flex flex-col min-h-screen ${background} ${bladeRunner.variable}`}
        >
          <NavBar></NavBar>
          <div className="relative flex h-full flex-1">
            <Component {...pageProps}></Component>
          </div>
        </div>
      </BackgroundContext.Provider>
      <ToastContainer></ToastContainer>
      <Footer></Footer>
    </SessionProvider>
  );
}
