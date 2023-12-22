import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import UploadFont from "../../components/UploadFont";
import { useRouter } from "next/router";
import Head from "next/head";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { userHavePermission } from "../../utils/authorization/validation/permissions/server";
import { VIEW_FONTS } from "../../utils/authorization/permissions";

export default function FontPage({}: {}) {
  const router = useRouter();
  const session = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push("/");
    },
  });

  return (
    <div className="w-full flex flex-col md:flex-row justify-center gap-8 items-center">
      <Head>
        <title>
          {router.query.fontName ? "Editar fuente" : "Subir fuente "}
        </title>
      </Head>
      <div className="container bg-white p-2 md:p-4 lg:p-8 rounded-md w-max">
        <h1>{router.query.fontName ? "Editar fuente" : "Subir fuente "}</h1>
        <hr className="mb-4" />
        <UploadFont
          fontName={
            Array.isArray(router.query.fontName)
              ? router.query.fontName.reduce((prev, act) => prev + act)
              : router.query.fontName
          }
        ></UploadFont>
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

  if (!(await userHavePermission(session, VIEW_FONTS))) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
