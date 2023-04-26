import { GetServerSideProps } from "next";
import { FontsType } from "../utils/database/models";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import useSWR from "swr";
import { useState } from "react";
import fetcher from "../utils/swr";
import Alert from "../components/Alert";
import { backgroundGradient } from "../utils/styles";
export default function FontsComponent() {
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useSWR(`/api/fonts?page=${page}`, (url) =>
    fetcher(url, { credentials: "include" })
  );

  return (
    <div
      className={`flex flex-col items-center justify-center w-full ${backgroundGradient}`}
    >
      <div className="flex flex-col gap-4 bg-white p-4 md:p-8 rounded-sm">
        <h2 className="text-lg font-bold">Fuentes disponibles:</h2>
        {error && !isLoading && (
          <Alert inline={false}>Error al cargar las fuentes</Alert>
        )}
        {data && data.data && Array.isArray(data.data) && (
          <>
            <ul className="flex flex-col gap-y-2">
              {(data.data as FontsType["dataValues"][]).map((font) => (
                <li key={font.nombre}>{font.nombre}</li>
              ))}
              <div>
                {data.data.length < 1 && (
                  <Alert>No hay fuentes en esta página!</Alert>
                )}
              </div>
            </ul>
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
                <button
                  onClick={() => setPage((page) => page - 1)}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Página anterior
                </button>
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
