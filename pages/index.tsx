import { Canvas } from "@react-three/fiber";
import Head from "next/head";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { ErrorBoundary } from "../components/errors/ErrorBoundary";
import { Background } from "../components/three/Background";
import WebGL from "../utils/three/compatibility";
import { BackgroundContext } from "../context/BackgroundContext";

const FallbackCanvas = function () {
  return (
    <div className="w-full h-full grid place-items-center place-content-center text-white">
      <h1 className={`font-blade text-bc-pink-1`}>bienvenido a bashcrashers</h1>{" "}
      <span>
        Genera tu banner
        <Link className="text-blue-600" href="/banner">
          {" "}
          aquí!
        </Link>
      </span>
    </div>
  );
};

export default function Home() {
  const [compatibility, setCompatibility] = useState(false);

  const { setBackground, setDefault } = useContext(BackgroundContext)!;

  useEffect(() => {
    setBackground("bg-black");
    return () => {
      setDefault();
    };
  }, [setBackground, setDefault]);

  useEffect(() => {
    setCompatibility(WebGL.isWebGLAvailable());
  }, []);
  return (
    <>
      <Head>
        <title>BashCrashers MusicApp</title>
        <meta
          name="description"
          content="Genera tu banner de música ahora mismo!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full flex-1 bg-black">
        {compatibility && (
          <ErrorBoundary fallback={<FallbackCanvas></FallbackCanvas>}>
            <Canvas camera={{ position: [0, 0, 5] }}>
              <Background></Background>
            </Canvas>
          </ErrorBoundary>
        )}
        {compatibility && (
          <div className="absolute bottom-0 right-0 bg-white bg-opacity-70 text-sm px-2 py-px rounded-sm">
            Multimedia creada por{" "}
            <a
              href="https://ernestorb.com"
              className="text-red-700 hover:text-red-800"
            >
              Ernesto Ramírez
            </a>
          </div>
        )}
        {!compatibility && <FallbackCanvas></FallbackCanvas>}
      </div>
    </>
  );
}
