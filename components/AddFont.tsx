import useSWR from "swr";
import fetcher from "../utils/swr";
import { FontsType } from "../utils/database/models";
import { perserveStatus } from "../utils";
import { toast } from "react-toastify";
import Alert from "./Alert";

export default function AddFont({
  id,
  bannerFonts,
}: {
  id: string;
  bannerFonts: FontsType["dataValues"][];
}) {
  const { data, error, isLoading } = useSWR("/api/fonts", fetcher);

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
            {font.nombre}
          </li>
        ))}
      </ul>
      <select name="font" id="">
        {data &&
          data.data?.map((font: any) => (
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
    </form>
  );
}
