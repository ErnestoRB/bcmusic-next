import useSWR from "swr";
import fetcher from "../utils/swr";
import { FontsType } from "../utils/database/models";
import { perserveStatus } from "../utils";
import { toast } from "react-toastify";
import Alert from "./Alert";
import { useEffect, useState } from "react";

type FontsArray = FontsType["dataValues"][];

export default function AddFont({
  id,
  bannerFonts,
}: {
  id: string;
  bannerFonts: FontsArray;
}) {
  const { data, error, isLoading, mutate } = useSWR("/api/fonts", fetcher);

  const [availableFonts, setAvailableFonts] = useState<FontsArray>();

  useEffect(() => {
    if (bannerFonts && data && data.data && Array.isArray(data.data)) {
      setAvailableFonts(
        (data.data as FontsArray).filter(
          (font) =>
            bannerFonts.findIndex(
              (bannerFont) => font.nombre === bannerFont.nombre
            ) === -1
        )
      );
    }
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
      <h1 className="text-xl font-bold">Añadir fuente</h1>
      <h3 className="text-lg">Fuentes añadidas:</h3>
      <ul className="list-disc list-inside">
        {bannerFonts.length === 0 && (
          <Alert>No hay fuentes en el banner aún</Alert>
        )}
        {bannerFonts.map((font) => (
          <li className="" key={font.nombre}>
            {font.nombre}{" "}
            <button
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
            </button>
          </li>
        ))}
      </ul>
      {availableFonts && availableFonts.length > 0 && (
        <>
          <h3 className="text-lg">Fuentes disponibles para añadir:</h3>

          <select name="font" id="">
            {availableFonts.map((font) => (
              <option key={font.nombre} value={font.nombre}>
                {font.nombre}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-green-500 text-white hover:bg-green-600"
            disabled={isLoading || error}
          >
            Añadir
          </button>
        </>
      )}
      {(!availableFonts || availableFonts.length === 0) && (
        <b>No hay más fuentes por agregar!</b>
      )}
    </form>
  );
}
