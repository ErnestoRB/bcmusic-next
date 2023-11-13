import useSWRInfinite from "swr/infinite";
import fetcher from "../utils/swr";
import { perserveStatus } from "../utils";
import { toast } from "react-toastify";
import Alert from "./Alert";
import { useMemo } from "react";
import { ResponseData } from "../types/definitions";
import Link from "./Link";
import { Button } from "./Button";
import { useSWRInfinitePagination } from "../utils/hooks/useSWRPagination";
import { IFontType } from "../utils/database/models/Fonts";

type FontsArray = IFontType["dataValues"][];

export default function AddFont({
  id,
  bannerFonts,
}: {
  id: string;
  bannerFonts: FontsArray;
}) {
  const { data, error, isLoading, setSize, mutate, lastPage } =
    useSWRInfinitePagination("/api/fonts");

  const availableFonts = useMemo(() => {
    if (bannerFonts && data) {
      return (data?.flat() as ResponseData<FontsArray>[])
        .map((data) => data.data)
        .flat()
        .filter(
          (font) =>
            bannerFonts.findIndex(
              (bannerFont) => font?.name === bannerFont.name
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
      <ul>
        <li>
          Puedes subir nuevas fuentes <Link href="/font">aquí</Link>
        </li>
        <li>
          Puedes ver las fuentes disponibles <Link href="/fonts">aquí</Link>
        </li>
      </ul>

      <h3>Fuentes añadidas:</h3>
      <ul className="list-disc list-inside">
        {bannerFonts.length === 0 && (
          <Alert>No hay fuentes en el banner aún</Alert>
        )}
        {bannerFonts.map((font) => (
          <li className="" key={font.name}>
            {font.name}{" "}
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white p-1"
              onPressEnd={() => {
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
              <option key={font!.name} value={font!.name}>
                {font!.name}
              </option>
            ))}
            {!lastPage && (
              <option value="loadMore" key={"select"}>
                Cargar más...
              </option>
            )}
          </select>
          <Button
            type="submit"
            className="bg-green-500 text-white hover:bg-green-600"
            isDisabled={isLoading || error}
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
