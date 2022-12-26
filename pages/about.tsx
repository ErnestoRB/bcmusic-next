import { GetStaticProps } from "next";
import Head from "next/head";
import { MIN_ARTISTS } from "./api/spotify/banner";

export default function About({ MIN_ARTISTS }: { MIN_ARTISTS: number }) {
  return (
    <div className="flex flex-col items-center justify-center w-full bg-stone-300">
      <Head>
        <title>Sobre la aplicación</title>
      </Head>
      <div className="max-w-lg bg-white p-2 md:p-4 shadow-lg rounded">
        <h1 className="text-3xl">BashCrashers MusicApp </h1>
        <p>
          Al momento, la aplicación sólo genera banners a partir de los artistas
          favoritos de un usuario registrado en Spotify. Para ello, necesitas
          vincular tu cuenta de Spotify.
        </p>
        <h2 className="text-2xl">¿Como funciona?</h2>
        <p>
          Se obtienen los artistas &quot;favoritos&quot; del usuario y se busca
          dentro de los rangos de tiempo: <b>corto, mediano y largo plazo</b>.
          <br />
          Primero se intenta generar uno de corto plazo, si no hay información
          suficiente al respecto (al menos {MIN_ARTISTS}) se intentan con los
          siguientes, en orden.
          <br /> Es decir,{" "}
          <b>siempre genera el banner con la información más reciente</b>{" "}
          (actualizada aproximadamente cada 4 semanas{" "}
          <a
            className="text-blue-600 hover:text-blue-400"
            href="https://developer.spotify.com/documentation/web-api/reference/#/operations/get-users-top-artists-and-tracks"
          >
            según la API de Spotify
          </a>
          )
        </p>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      MIN_ARTISTS: MIN_ARTISTS,
    },
  };
};
