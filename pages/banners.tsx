import { GetServerSideProps } from "next";
import Head from "next/head";
import { BannerRecord, BannerRecordType } from "../utils/database/models";
import BannerPreview from "../components/BannerPreview";

export default function BannerPage({
  availableBanners,
}: {
  availableBanners: BannerRecordType["dataValues"][] | undefined;
  banners: { mes: number; cantidad: number }[];
}) {
  return (
    <div className="w-full bg-gradient-to-tr from-bc-purple-1 via-blue-300 to-stone-100 flex flex-col md:flex-row justify-center gap-8 items-center">
      <Head>
        <title>Banners disponibles</title>
      </Head>
      <div className="flex flex-col gap-y-8 bg-white max-w-7xl w-full bg-opacity-70 p-2 md:p-4">
        <h1 className="text-center text-3xl font-bold">Banners disponibles</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 place-items-center">
          {availableBanners &&
            availableBanners.map((banner) => (
              <BannerPreview
                key={banner.id}
                bannerData={banner}
              ></BannerPreview>
            ))}
        </div>
      </div>
    </div>
  );
}
export const getServerSideProps: GetServerSideProps = async () => {
  const availableBanners: BannerRecordType[] =
    await BannerRecord.findAll(); /*  await getAvailableBanners(); */
  return {
    props: { availableBanners: availableBanners.map((a) => a.dataValues) },
  };
};
