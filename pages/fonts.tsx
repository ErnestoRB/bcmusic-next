import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import useSWR from "swr";
import { useEffect, useState } from "react";
import fetcher from "../utils/swr";
import Alert from "../components/Alert";
import { isAdmin } from "../utils/authorization/validation/permissions/browser";
import { CopyToClipboards } from "../components/CopyToClipboard";
import { loadFontsAsync, perserveStatus } from "../utils";
import { Button } from "../components/Button";
import { toast } from "react-toastify";
import Link from "../components/Link";
import { IFontType } from "../utils/database/models/Fonts";
import { Spinner } from "../components/Spinner";

const filterFullfiled = (
  r: PromiseSettledResult<unknown>
): r is PromiseFulfilledResult<unknown> => r.status == "fulfilled";

export default function FontsComponent() {
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useSWR(`/api/fonts?page=${page}`, (url) =>
    fetcher(url, { credentials: "include" })
  );
  const [fontFacesLoaded, setFontsLoaded] = useState<FontFace[] | undefined>(
    undefined
  );
  useEffect(() => {
    if (fontFacesLoaded) {
      for (const font of fontFacesLoaded) {
        document.fonts.add(font);
      }
    }
  }, [fontFacesLoaded]);

  useEffect(() => {
    if (data && data.data && Array.isArray(data.data)) {
      loadFontsAsync(data.data as IFontType["dataValues"][]).then((fonts) => {
        setFontsLoaded(
          fonts
            .filter(filterFullfiled)
            .map(
              (result) =>
                (result as unknown as PromiseFulfilledResult<FontFace>).value
            )
        );
      });
    }
    return () => setFontsLoaded(undefined);
  }, [data]);

  return (
    <div className={`flex flex-col items-center justify-center w-full`}>
      <div className="flex flex-col gap-4 bg-white p-4 md:p-8 rounded-sm">
        <h2 className="text-xl font-bold">Fuentes disponibles:</h2>
        <p>
          Añadir nueva fuente <Link href={"font"}>aquí</Link>
        </p>
        {isLoading && !data && !error && <Spinner></Spinner>}
        {error && !isLoading && (
          <Alert inline={false}>Error al cargar las fuentes</Alert>
        )}
        {data && data.data && Array.isArray(data.data) && fontFacesLoaded && (
          <>
            <div className="flex flex-col gap-y-2">
              {(data.data as IFontType["dataValues"][]).map((font) => (
                <div
                  key={font.name}
                  className="flex flex-col rounded-sm border-l-4 border-l-rose-600 bg-stone-50 p-2 md:p-4 gap-y-2"
                >
                  <h4>{font.name} </h4>
                  <hr />

                  <div className="flex flew-wrap justify-end">
                    <Link href={`/font/${font.name}`}>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Editar
                      </Button>
                    </Link>
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onPressEnd={() => {
                        fetch(`/api/font/${font.name}`, { method: "DELETE" })
                          .then(perserveStatus)
                          .then((res) => {
                            if (res.ok) {
                              toast(res.json?.message ?? "Fuente eliminada");
                            } else {
                              toast(
                                res.json?.message ??
                                  "No se pudo eliminar la fuente"
                              );
                            }
                          });
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                  <h5>Previsualización</h5>
                  <div
                    className="p-2 bg-stone-700 rounded-lg text-white text-lg"
                    style={{
                      fontFamily: font.name,
                    }}
                  >
                    <span>ABCDEFGHIJKLMNOPQRSTUVWXYZ</span>
                    <br />
                    <span
                      style={{
                        fontFamily: font.name,
                      }}
                    >
                      abcdefghijklmnopqrstuvwxyz
                    </span>
                  </div>

                  <span>
                    Copiar nombre
                    <CopyToClipboards>{font.name}</CopyToClipboards>
                  </span>
                </div>
              ))}
              <div>
                {data.data.length < 1 && (
                  <Alert>No hay fuentes en esta página!</Alert>
                )}
              </div>
            </div>
            <div className="flex ">
              {data.data.length >= 1 && (
                <button
                  onClick={() => setPage((page) => page + 1)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1"
                >
                  Página siguiente
                </button>
              )}
              {page > 1 && (
                <Button
                  onPressEnd={() => setPage((page) => page - 1)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1"
                >
                  Página anterior
                </Button>
              )}
            </div>
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

  if (!session || !isAdmin(session.user.tipo_usuario)) {
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
