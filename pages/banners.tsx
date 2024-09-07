import Head from "next/head";
import BannerPreview from "../components/BannerPreview";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import fetcher from "../utils/swr";
import { BannerRecordWithAuthors } from "../types/definitions";
import { Spinner } from "../components/Spinner";
import Alert from "../components/Alert";

export default function BannerPage({}: {
  banners: { mes: number; cantidad: number }[];
}) {
  const { data, error, isLoading, isValidating } = useSWR(
    "/api/banners",
    fetcher
  );

  return (
    <div className="w-full flex flex-col md:flex-row justify-center items-center py-4 md:py-8">
      <Head>
        <title>Banners disponibles</title>
      </Head>
      <div className="flex flex-col  bg-white dark:bg-gray-900 text-black md:text-white dark:w-full md:max-w-7xl h-full p-2 md:p-4">
        <h1 className="text-center text-3xl font-bold py-4">Banners</h1>
        {isLoading && !data && (
          <div className="w-full grid place-items-center">
            <Spinner></Spinner>
            Cargando...
          </div>
        )}

        {data && data.data && data.data.length > 0 && (
          <div className="grid gap-y-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 place-items-center">
            {data.data.map((banner: BannerRecordWithAuthors) => (
              <div key={banner.id} className="grid place-items-center">
                <BannerPreview bannerData={banner}></BannerPreview>
              </div>
            ))}
          </div>
        )}
        {data && data.data && data.data.length == 0 && (
          <Alert type="info">Aún no hay ningun banner disponible</Alert>
        )}
        {data && !data.data && (
          <Alert type="error">No se pudieron cargar los banners</Alert>
        )}
        {!isValidating && !isLoading && error && (
          <Alert type="error">No se pudieron cargar los banners</Alert>
        )}
      </div>
    </div>
  );
}
