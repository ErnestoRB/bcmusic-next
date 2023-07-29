import Head from "next/head";

export default function About() {
  return (
    <div className={`flex flex-col items-center justify-center w-full `}>
      <Head>
        <title>Sobre la aplicación</title>
      </Head>
      <div className="max-w-lg bg-white p-2 md:p-4 shadow-lg rounded">
        <h1>BashCrashers MusicApp </h1>
        <p>
          Es una plataforma que permite generar diseños (banners) apartir de
          información proporcionada por la API de Spotify.
        </p>
        <br />
        <h2 className="text-2xl font-semibold">¿Como funciona?</h2>
        <p>
          Cada diseño declara qué y cuanta información es necesaria para poder
          generarlo. De esta manera, ¡BCMusicApp permite que tú desarrolles un
          diseño y que sea integrado en esta página!{" "}
          <i>Próximamente más información</i>.
        </p>
      </div>
    </div>
  );
}
