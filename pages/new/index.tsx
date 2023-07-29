import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import BannerForm from "../../components/BannerForm";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { GetServerSideProps } from "next";
import { isAdmin } from "../../utils/validation/user";

export default function CreateBannerCode() {
  const { push } = useRouter();
  const session = useSession({
    required: true,
    onUnauthenticated: () => {
      push("/");
    },
  });

  return (
    <div className={`flex flex-col items-center justify-center w-full `}>
      <Head>
        <title>Programar nuevo banner</title>
      </Head>
      <div className="bg-white p-2 md:p-4 shadow-lg rounded max-w-7xl w-full">
        <>
          <h1 className="mb-4">Programar nuevo banner</h1>
          <hr />
          <BannerForm></BannerForm>
        </>
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
