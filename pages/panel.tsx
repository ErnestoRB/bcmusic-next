import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Alert from "../components/Alert";

export default function Panel() {
  const router = useRouter();
  const session = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push("/");
    },
  });

  if (session.status === "loading") {
    return <div>Cargando...</div>;
  }

  return (
    <div className="w-full bg-gradient-to-tr from-bc-purple-1 via-blue-300 to-stone-100 flex justify-center items-center">
      <div className="max-w-md p-2 md:p-4 rounded-sm bg-white flex flex-col gap-y-2 shadow-lg">
        <Head>
          <title>Panel de usuario</title>
        </Head>
        <h1 className="text-3xl">Panel de usuario</h1>
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
      </div>
    </div>
  );
}
