import Head from "next/head";
import BannerPreview from "../components/BannerPreview";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import fetcher from "../utils/swr";
import { BannerRecordWithAuthors } from "../types/definitions";
import { Loading } from "../components/Loading";
import Link from "../components/Link";

export default function BannerPage({}: {
  banners: { mes: number; cantidad: number }[];
}) {
  const { data, error, isLoading } = useSWR("/api/banners", fetcher);

  return (
    <div className="w-full flex flex-col md:flex-row justify-center gap-8 items-center py-4 md:py-8">
      <Head>
        <title>Banners disponibles</title>
      </Head>
      <div className="flex flex-col gap-y-8 bg-white max-w-7xl w-full bg-opacity-70 p-2 md:p-4">
        {isLoading && (
          <div className="w-ful flex justify-center">
            <Loading></Loading>
            Cargando...
          </div>
        )}
        {data && data.data && (
          <div>
            <h1 className="text-center text-3xl font-bold">
              Banners disponibles
            </h1>
            <div className="grid gap-y-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 place-items-center">
              {data.data.map((banner: BannerRecordWithAuthors) => (
                <div
                  key={banner.id}
                  className="grid place-items-cente bg-white"
                >
                  <BannerPreview bannerData={banner}></BannerPreview>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
