import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import UploadFont from "../../components/UploadFont";
import { useRouter } from "next/router";
import Head from "next/head";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { isAdmin } from "../../utils/validation/user";

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
      <div className="container bg-white p-2 md:p-4 lg:p-8 rounded-md">
        <h1>{router.query.fontName ? "Editar fuente" : "Subir fuente "}</h1>
        <hr className="mb-4" />
        <div className="">
          <UploadFont
            fontName={
              Array.isArray(router.query.fontName)
                ? router.query.fontName.reduce((prev, act) => prev + act)
                : router.query.fontName
            }
          ></UploadFont>
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

  return {
    props: {},
  };
};
