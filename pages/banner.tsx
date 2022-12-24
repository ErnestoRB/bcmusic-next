import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useEffect, useRef, useState } from "react";
import { sequelize } from "../utils/database/connection";
import { Banner } from "../utils/database/models";
import { meses } from "../utils/";

import { authOptions } from "./api/auth/[...nextauth]";
import { Op } from "sequelize";
import Alert from "../components/Alert";
import Head from "next/head";

let isLoading = false;
let downloaded = false;
export default function BannerPage({
  banners,
}: {
  banners: { mes: number; cantidad: number }[];
}) {
  const [objectUrl, setObjectUrl] = useState<string>("");
  const [error, setError] = useState("");
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!objectUrl) return;
    if (downloaded) return;
    linkRef.current?.click();
    downloaded = true;
  }, [objectUrl]);

  return (
    <div className="w-full bg-gradient-to-tr from-bc-purple-1 via-blue-300 to-stone-100 flex justify-center items-center">
      <Head>
        <title>Generar banner</title>
      </Head>
      <div className="max-w-md p-2 md:p-4 rounded-sm bg-white flex flex-col gap-y-2 shadow-lg">
        <h1 className="text-3xl">Generar banners</h1>
        {error && <Alert>{error}</Alert>}
        <button
          className="bg-green-400 text-black"
          onClick={() => {
            if (isLoading) return;
            isLoading = true;
            fetch("/api/spotify/banner", { credentials: "include" })
              .then(async (res) => {
                if (res.status === 200) {
                  const data = await res.blob();
                  const file = window.URL.createObjectURL(data);
                  setObjectUrl(file);
                  // https://stackoverflow.com/questions/41947735/custom-name-for-blob-url/56923508#56923508
                  return;
                }
                const data = await res.json();
                setError(data?.message || "");
              })
              .finally(() => (isLoading = false));
          }}
        >
          Crear banner
        </button>
        <span className="text-sm">
          <b>Aviso:</b> La creación del banner surge en nuestro servidor, pero
          no la almacenamos en él. Si no la descargas antes de cerrar la
          pestaña, tendrás que generarla más tarde.
        </span>
        {objectUrl && <hr className="my-4" />}
        <span style={{ display: objectUrl ? "" : "none" }}>
          <b>¡Gracias!</b> No se descargó automáticamente?{" "}
          <a
            className="text-blue-700"
            href={objectUrl}
            ref={linkRef}
            download="banner.png"
          >
            volver a descargar
          </a>
        </span>
        <hr className="my-4" />
        <h2 className="text-xl">
          Historial de banners generados ({new Date().getFullYear()})
        </h2>
        <table className="text-center border border-black">
          <thead className="bg-black text-white ">
            <tr>
              <td>Mes</td>
              <td>Cantidad</td>
            </tr>
          </thead>
          <tbody className="even:bg-stone-50 odd:bg-stone-100 hover:bg-stone-300">
            {banners.map((item) => {
              return (
                <tr key={item.mes}>
                  <td>{meses[item.mes - 1]}</td>
                  <td>
                    <b>{item.cantidad}</b>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(
    req,
    res,
    // @ts-ignore
    authOptions(req, res)
  );
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
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
  const banners = bannerModels.map((banner) => banner.dataValues);

  return {
    props: {
      banners: JSON.parse(JSON.stringify(banners)),
    },
  };
};
