import Head from "next/head";
import BannerPreview from "../components/BannerPreview";
import { useSession } from "next-auth/react";
import Link from "next/link";
import useSWR from "swr";
import fetcher from "../utils/swr";
import { BannerRecordWithAuthors } from "../types/definitions";

export default function BannerPage({}: {
  banners: { mes: number; cantidad: number }[];
}) {
  const { data, error, isLoading } = useSWR("/api/banners", fetcher);

  const session = useSession();
  return (
    <div className="w-full bg-gradient-to-tr from-bc-purple-1 via-blue-300 to-stone-100 flex flex-col md:flex-row justify-center gap-8 items-center py-4 md:py-8">
      <Head>
        <title>Banners disponibles</title>
      </Head>
      <div className="flex flex-col gap-y-8 bg-white max-w-7xl w-full bg-opacity-70 p-2 md:p-4">
        {data && data.data && (
          <div>
            <h1 className="text-center text-3xl font-bold">
              Banners disponibles
            </h1>
            <div className="grid gap-y-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 place-items-center">
              {data.data.map((banner: BannerRecordWithAuthors) => (
                <div key={banner.id}>
                  {session &&
                    session.data?.user?.tipo_usuario?.nombre === "admin" && (
                      <div className="flex">
                        <Link
                          href={`/code/${banner.id}`}
                          className="bg-bc-purple-2 hover:bg-bc-purple-3 text-white p-1 inline-block"
                        >
                          Ver código
                        </Link>
                        <Link
                          href={`/admin/banner/${banner.id}`}
                          className="bg-purple-700 hover:bg-purple-800 text-white p-1 inline-block"
                        >
                          Editar metadatos
                        </Link>
                      </div>
                    )}
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
