import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { BannerRecord, BannerRecordModel } from "../utils/database/models";
import UploadFont from "../components/UploadFont";
import { useRouter } from "next/router";
import Head from "next/head";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { isAdmin } from "../utils/validation/user";

export default function UploadPage({}: {
  availableBanners: BannerRecordModel["dataValues"][] | undefined;
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
      <Head>
        <title>Subir fuente</title>
      </Head>
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
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(
    req,
    res,
    authOptions(req, res)
  );

  if (!session || !isAdmin(session.user.tipo_usuario?.nombre)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const availableBanners: BannerRecordModel[] = await BannerRecord.findAll();
  return {
    props: { availableBanners: availableBanners.map((a) => a.dataValues) },
  };
};
