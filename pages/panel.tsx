import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Op } from "sequelize";
import Alert from "../components/Alert";
import { BannerHistorial } from "../components/BannerHistorial";
import { sequelize } from "../utils/database/connection";
import { Banner } from "../utils/database/models";
import { backgroundGradient } from "../utils/styles";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Panel({
  banners,
}: {
  banners: { mes: number; cantidad: number }[];
}) {
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
    <div
      className={`w-full ${backgroundGradient} flex justify-center items-center`}
    >
      <div className="max-w-md p-2 md:p-4 rounded-sm bg-white flex flex-col gap-y-2 shadow-lg">
        <Head>
          <title>Panel de usuario</title>
        </Head>
        <h1 className="text-3xl font-bold">Panel de usuario</h1>
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
        <BannerHistorial banners={banners}></BannerHistorial>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  let banners = null;
  const session = await unstable_getServerSession(
    req,
    res,
    authOptions(req, res)
  );
  if (session) {
    const bannerModels = await Banner.findAll({
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("*")), "cantidad"],
        [sequelize.fn("MONTH", sequelize.col("fecha_generado")), "mes"],
      ],
      group: "mes",
      order: ["mes"],
      where: {
        [Op.and]: [
          { idUsuario: session?.user.id },
          sequelize.where(
            sequelize.fn("YEAR", sequelize.fn("CURDATE")),
            sequelize.fn("YEAR", sequelize.col("fecha_generado"))
          ),
        ],
      },
    });
    banners = bannerModels.map((banner) => banner.dataValues);
    banners = JSON.parse(JSON.stringify(banners));
  }
  return {
    props: {
      banners,
    },
  };
};
