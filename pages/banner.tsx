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
import bannerImage from "../images/banner.png";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";

let downloaded = false;
export default function BannerPage({
  banners,
}: {
  banners: { mes: number; cantidad: number }[];
}) {
  const session = useSession();
  const [isLoading, setLoading] = useState(false);

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
    <div className="w-full bg-gradient-to-tr from-bc-purple-1 via-blue-300 to-stone-100 flex flex-col md:flex-row justify-center gap-8 items-center">
      <Head>
        <title>Generar banner</title>
      </Head>
      <figure className="bg-white bg-opacity-40 p-4 max-w-xs sm:w-64 md:w-72 lg:w-96">
        <Image src={bannerImage} alt="Ejemplo de banner a generar"></Image>
        <figcaption className="text-center">Ejemplo de banner</figcaption>
      </figure>
      <div className="max-w-md p-2 md:p-4 rounded-sm bg-white flex flex-col gap-y-2 shadow-lg">
        {session?.status !== "authenticated" && (
          <>
            <h1 className="text-3xl">¡Genera ya tu banner! ¿Qué esperas?</h1>
            <p>
              Sólo necesitar crear una cuenta, da click{" "}
              <Link
                href="/auth/login"
                className="text-red-600 hover:text-red-400"
              >
                aquí
              </Link>{" "}
              para iniciar sesión
            </p>
            <p>
              De paso, lee nuestra{" "}
              <Link
                href="politicas"
                className="text-bc-purple-2 hover:text-bc-purple-1"
              >
                política de privacidad!
              </Link>
            </p>
          </>
        )}

        {session?.status === "authenticated" && (
          <>
            {isLoading && <Alert type="info">Cargando...</Alert>}

            <h1 className="text-3xl">Generar banner</h1>
            {error && <Alert>{error}</Alert>}
            <button
              className="bg-green-400 text-black"
              onClick={() => {
                if (isLoading) return;
                setLoading(true);
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
                  .finally(() => setLoading(false));
              }}
            >
              Crear banner
            </button>
            <span className="text-sm">
              <b>Aviso:</b> La creación del banner surge en nuestro servidor,
              pero no la almacenamos en él. Si no la descargas antes de cerrar
              la pestaña, tendrás que generarla más tarde.
            </span>

            {objectUrl && (
              <>
                <hr className="my-4" />
                <Alert type="info">
                  <b>¡Gracias!</b> ¿No se descargó automáticamente?{" "}
                  <a
                    className="text-blue-700"
                    href={objectUrl}
                    ref={linkRef}
                    download="banner.png"
                  >
                    Volver a descargar
                  </a>
                </Alert>
              </>
            )}

            {banners && (
              <>
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
              </>
            )}
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
    // @ts-ignore
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
    const banners = bannerModels.map((banner) => banner.dataValues);

    return {
      props: {
        banners: JSON.parse(JSON.stringify(banners)),
      },
    };
  }
  return { props: {} };
};
