import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Alert from "../components/Alert";
import { BannerHistorial } from "../components/BannerHistorial";
import { backgroundGradient } from "../utils/styles";
import { authOptions } from "./api/auth/[...nextauth]";
import Link from "../components/Link";
import { Loading } from "../components/Loading";

export default function Panel() {
  const router = useRouter();
  const session = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push("/");
    },
  });

  return (
    <div
      className={`w-full ${backgroundGradient} flex justify-center items-center`}
    >
      <div className="max-w-md p-2 md:p-4 rounded-sm bg-white flex flex-col gap-y-2 shadow-lg">
        <Head>
          <title>Panel de usuario</title>
        </Head>
        {session.status === "loading" && (
          <div className="w-ful flex justify-center">
            <Loading></Loading>
            Cargando...
          </div>
        )}
        {session && (
          <>
            <h1 className="text-3xl font-bold">Panel de usuario</h1>
            <h2>Tipo de usuario: {session?.data?.user.tipo_usuario?.nombre}</h2>
            {session?.data?.user.tipo_usuario?.nombre === "admin" && (
              <div className="flex flex-col flex-wrap">
                <Link href="/new">Crear nuevo banner</Link>
                <Link href="/uploadFont" className="text-blue-600 underline">
                  Subir nueva fuente
                </Link>
              </div>
            )}
            <Alert type="warning">
              Si no aparece información extra en este panel quiere decir que no
              hemos recolectado información al respecto
            </Alert>
            <span>
              Imagen de usuario:{" "}
              {session?.data?.user?.image && (
                <Image
                  className="max-w-[64px] inline mx-px"
                  width={32}
                  height={32}
                  src={session.data.user.image}
                  alt="user photo"
                ></Image>
              )}
            </span>
            <span>
              Nombre:{" "}
              {`${session?.data?.user?.name || ""} ${
                session?.data?.user?.apellido || ""
              }`}
            </span>
            <span>E-mail: {`${session?.data?.user?.email || ""}`}</span>
            <span>
              Fecha de nacimiento:{" "}
              {session?.data?.user?.nacimiento &&
                `${
                  new Intl.DateTimeFormat().format(
                    new Date(session?.data?.user?.nacimiento || new Date())
                  ) || ""
                }`}
            </span>
            <span>País de origen: {`${session?.data?.user?.pais || ""}`}</span>
            <hr />
            <BannerHistorial></BannerHistorial>
          </>
        )}
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

  if (!session) {
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
