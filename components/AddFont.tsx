import useSWRInfinite from "swr/infinite";
import fetcher from "../utils/swr";
import { FontsType } from "../utils/database/models";
import { perserveStatus } from "../utils";
import { toast } from "react-toastify";
import Alert from "./Alert";
import { useMemo } from "react";
import { ResponseData } from "../types/definitions";
import Link from "./Link";
import { Button } from "./Button";

type FontsArray = FontsType["dataValues"][];

const getKey = (pageIndex: number, previousPageData: any[]) => {
  if (previousPageData && !previousPageData.length) return null; // reached the end
  return `/api/fonts?page=${pageIndex + 1}`; // SWR key
};

export default function AddFont({
  id,
  bannerFonts,
}: {
  id: string;
  bannerFonts: FontsArray;
}) {
  const { data, error, isLoading, setSize, size, mutate } = useSWRInfinite(
    getKey,
    (url) => fetcher(url, { credentials: "include" })
  );

  const availableFonts = useMemo(() => {
    if (bannerFonts) {
      return (data?.flat() as ResponseData<FontsArray>[])
        .map((data) => data.data)
        .flat()
        .filter(
          (font) =>
            bannerFonts.findIndex(
              (bannerFont) => font?.nombre === bannerFont.nombre
            ) === -1
        );
    }
    return undefined;
  }, [data, bannerFonts]);

  return (
    <form
      className="flex flex-col max-w-md gap-y-2 shadow-inner rounded-sm p-2 bg-gray-100"
      onSubmit={(evt) => {
        evt.preventDefault();
        const form = evt.currentTarget;
        const font = form.elements.namedItem("font")! as HTMLSelectElement;

        fetch(
          "/api/banner/" +
            id +
            "?" +
            new URLSearchParams({
              addFont: font.value,
            }),
          { method: "PATCH" }
        )
          .then(perserveStatus)
          .then((res) => {
            toast(res.json.message, { type: res.ok ? "success" : "error" });
          });
      }}
    >
      <h1>Añadir fuente</h1>
      <h3>Fuentes añadidas:</h3>
      <ul className="list-disc list-inside">
        {bannerFonts.length === 0 && (
          <Alert>No hay fuentes en el banner aún</Alert>
        )}
        {bannerFonts.map((font) => (
          <li className="" key={font.nombre}>
            {font.nombre}{" "}
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white p-1"
              onClick={() => {
                fetch(`/api/banner/${id}?deleteFont=${font.id}`, {
                  method: "DELETE",
                })
                  .then(perserveStatus)
                  .then((res) => {
                    toast(res.json.message, {
                      type: res.ok ? "success" : "error",
                    });
                    mutate();
                  });
              }}
            >
              Eliminar
            </Button>
          </li>
        ))}
      </ul>
      {availableFonts && availableFonts.length > 0 && (
        <>
          <h3 className="text-lg">Fuentes disponibles para añadir:</h3>
          <p>
            Puedes ver las fuentes disponibles <Link href="/fonts">aqui</Link>
          </p>
          <select
            name="font"
            id=""
            onChange={(e) => {
              const value = e.target.value;
              if (value == "loadMore") {
                e.preventDefault();

                setSize((s) => s + 1);
              }
            }}
          >
            {availableFonts.map((font) => (
              <option key={font!.nombre} value={font!.nombre}>
                {font!.nombre}
              </option>
            ))}
            {data?.[size - 1]?.data?.length > 0 && (
              <option
                value="loadMore"
                key={"select"}
                onChange={(e) => {
                  e.preventDefault();
                  setSize((s) => s + 1);
                }}
              >
                Cargar más...
              </option>
            )}
          </select>
          <Button
            type="submit"
            className="bg-green-500 text-white hover:bg-green-600"
            disabled={isLoading || error}
          >
            Añadir
          </Button>
        </>
      )}
      {(!availableFonts || availableFonts.length === 0) && (
        <b>No hay más fuentes por agregar!</b>
      )}
    </form>
  );
}
