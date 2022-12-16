import Head from "next/head";
import NavBar from "../components/NavBar";

export default function Home() {
  return (
    <div>
      <NavBar></NavBar>
      <Head>
        <title>BashCrashers MusicApp</title>
        <meta
          name="description"
          content="Genera tu banner de música ahora mismo!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full h-[90vh] flex flex-col items-center justify-center">
        <h1 className="text-4xl text-center">BashCrashers Music Aapp</h1>
        <p>¡Genera tu banner ahora mismo!</p>
      </main>
    </div>
  );
}
