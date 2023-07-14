import { GetServerSideProps } from "next";
import { FontsType } from "../utils/database/models";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import useSWR from "swr";
import { useEffect, useState } from "react";
import fetcher from "../utils/swr";
import Alert from "../components/Alert";
import { backgroundGradient } from "../utils/styles";
import { isAdmin } from "../utils/validation/user";
import { CopyToClipboards } from "../components/CopyToClipboard";
import { loadFontsAsync } from "../utils";
import { Button } from "../components/Button";

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
      loadFontsAsync(data.data as FontsType["dataValues"][]).then((fonts) => {
        setFontsLoaded(fonts);
      });
    }
    return () => setFontsLoaded(undefined);
  }, [data]);

  return (
    <div
      className={`flex flex-col items-center justify-center w-full ${backgroundGradient}`}
    >
      <div className="flex flex-col gap-4 bg-white p-4 md:p-8 rounded-sm">
        <h2 className="text-lg font-bold">Fuentes disponibles:</h2>
        {error && !isLoading && (
          <Alert inline={false}>Error al cargar las fuentes</Alert>
        )}
        {data && data.data && Array.isArray(data.data) && fontFacesLoaded && (
          <>
            <div className="flex flex-col gap-y-2">
              {(data.data as FontsType["dataValues"][]).map((font) => (
                <div
                  key={font.nombre}
                  className="rounded-sm bg-stone-50 p-2 md:p-4"
                >
                  <div
                    style={{
                      fontFamily: font.nombre,
                    }}
                  >
                    <span>ABCDEFGHIJKLMNOPQRSTUVWXYZ</span>
                    <br />
                    <span
                      style={{
                        fontFamily: font.nombre,
                      }}
                    >
                      abcdefghijklmnopqrstuvwxyz
                    </span>
                  </div>

                  <span>
                    Puede usarse en los scripts como
                    <CopyToClipboards>{font.nombre}</CopyToClipboards>
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
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Página siguiente
                </button>
              )}
              {page > 1 && (
                <Button
                  onClick={() => setPage((page) => page - 1)}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
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
