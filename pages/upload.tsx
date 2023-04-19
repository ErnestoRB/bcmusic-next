import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { BannerRecord, BannerRecordType } from "../utils/database/models";
import UploadFont from "../components/UploadFont";
import { useRouter } from "next/router";

export default function UploadPage({}: {
  availableBanners: BannerRecordType["dataValues"][] | undefined;
  banners: { mes: number; cantidad: number }[];
}) {
  const router = useRouter();
  const session = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push("/");
    },
  });

  return (
    <div className="w-full bg-gradient-to-tr from-bc-purple-1 via-blue-300 to-stone-100 flex flex-col md:flex-row justify-center gap-8 items-center">
      <div className="container bg-white p-2 md:p-4 lg:p-8 rounded-md">
        <h1 className="text-2xl font-bold">Subir fuente</h1>
        <hr className="mb-4" />
        <div className="">
          <UploadFont></UploadFont>
        </div>
      </div>
    </div>
  );
}
export const getServerSideProps: GetServerSideProps = async () => {
  const availableBanners: BannerRecordType[] = await BannerRecord.findAll();
  return {
    props: { availableBanners: availableBanners.map((a) => a.dataValues) },
  };
};
