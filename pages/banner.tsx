import { GetServerSideProps } from "next";
import { useEffect, useRef, useState } from "react";
import Alert from "../components/Alert";
import Head from "next/head";
import bannerImage from "../images/banner.png";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { BannerRecord, BannerRecordModel } from "../utils/database/models";
import { Button } from "../components/Button";

let downloaded = false;
export default function BannerPage({
  availableBanners,
}: {
  availableBanners: BannerRecordModel["dataValues"][] | undefined;
  banners: { mes: number; cantidad: number }[];
}) {
  const session = useSession();
  const [isLoading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string>();

  const [objectUrl, setObjectUrl] = useState<string>("");
  const [error, setError] = useState("");
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [isCompatible, setCompatible] = useState(true);

  useEffect(() => {
    if (!objectUrl) return;
    if (downloaded) return;
    linkRef.current?.click();
    downloaded = true;
  }, [objectUrl]);

  useEffect(() => {
    setCompatible(typeof URL?.createObjectURL != "undefined");
  }, []);

  return (
    <div className="w-full flex flex-col md:flex-row justify-center gap-8 items-center">
      <Head>
        <title>Generar banner</title>
      </Head>

      {!isCompatible && (
        <Alert>
          Tu navegador es antiguo y no será posible descargar el banner
        </Alert>
      )}
      {isCompatible && (
        <>
          <figure className="relative object-contain aspect-auto bg-white bg-opacity-40 p-4 max-w-xs sm:w-64 md:w-72 lg:w-96">
            {objectUrl ? (
              <Image
                src={objectUrl}
                alt={"Banner generado"}
                height="1920"
                width="1296"
              ></Image>
            ) : (
              <Image
                src={bannerImage}
                alt={"Ejemplo de banner a generar"}
              ></Image>
            )}
            <figcaption className="text-center">
              {objectUrl
                ? "¡Asi se ve tu banner!"
                : "Ejemplo de banner a generar"}
            </figcaption>
          </figure>
          <div className="max-w-md p-2 md:p-4 rounded-sm bg-white flex flex-col gap-y-2 shadow-lg">
            <div className="text-blue-600">
              <Link href="/banners">Ver todos los banners disponibles</Link>
            </div>
            {session?.status !== "authenticated" && (
              <>
                <h1>¡Genera ya tu banner! ¿Qué esperas?</h1>
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
              </>
            )}

            {session?.status === "authenticated" && (
              <>
                {isLoading && <Alert type="info">Cargando...</Alert>}
                <h1>Generar banner</h1>
                <h3>Diseños disponibles</h3>
                {availableBanners && (
                  <select
                    onChange={(evt) => {
                      setSelected(evt.target.value);
                    }}
                  >
                    <option>Selecciona un diseño</option>
                    {availableBanners.map((bannerConfig) => (
                      <option key={bannerConfig.id} value={bannerConfig.id}>
                        {bannerConfig.name}
                      </option>
                    ))}
                  </select>
                )}
                {error && <Alert>{error}</Alert>}
                <Button
                  className="bg-green-400 text-black"
                  onPress={() => {
                    if (isLoading) return;
                    if (!selected) return;

                    setLoading(true);
                    fetch(
                      `/api/spotify/banner?${new URLSearchParams({
                        id: selected,
                      })}`,
                      { credentials: "include" }
                    )
                      .then(async (res) => {
                        if (res.status === 200) {
                          const data = await res.blob();
                          const file = window.URL.createObjectURL(data);
                          setObjectUrl(file);
                          setError("");
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
                </Button>
                <span className="text-sm">
                  <b>Aviso:</b> La creación del banner surge en nuestro
                  servidor, pero no la almacenamos en él. Si no la descargas
                  antes de cerrar la pestaña, tendrás que generarla más tarde.
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
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
export const getServerSideProps: GetServerSideProps = async () => {
  const availableBanners: BannerRecordModel[] = await BannerRecord.findAll();
  return {
    props: { availableBanners: availableBanners.map((a) => a.dataValues) },
  };
};
