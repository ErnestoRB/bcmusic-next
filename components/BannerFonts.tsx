import { perserveStatus } from "../utils";
import { toast } from "react-toastify";
import Alert from "./Alert";
import { useMemo, useState } from "react";
import { ResponseData } from "../types/definitions";
import Link from "./Link";
import { Button } from "./Button";
import useSWR from "swr";
import { useSWRInfinitePagination } from "../utils/hooks/useSWRPagination";
import FontPreview from "./banner/FontPreview";
import Image from "next/image";
import clipboardIcon from "../images/clipboard.svg";
import trashIcon from "../images/trash.svg";
import { useClipboard } from "../utils/hooks/useClipboard";
import { AppModal } from "./Modal";
import { IBannerFont } from "../pages/api/banner/[id]/fonts";
import { fetcherMap } from "../utils/swr";
import { Spinner } from "./Spinner";

type FontsArray = IBannerFont[];

export default function AddFont({ id }: { id: string }) {
  const { data, error, isLoading, setSize, mutate, lastPage } =
    useSWRInfinitePagination("/api/fonts");

  const {
    data: bannerFonts,
    error: fontError,
    isLoading: isLoadingFonts,
    isValidating: isValidatingFonts,
    mutate: mutateFonts,
  } = useSWR<IBannerFont[]>(() => id && `/api/banner/${id}/fonts`, fetcherMap);

  const { isCompatible, toClipboard } = useClipboard();
  const [openModal, setModal] = useState<boolean>(false);
  const [fontId, setFontId] = useState<string | null>(null);

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

  const handleDelete = (fontId: string) =>
    fetch(`/api/banner/${id}?deleteFont=${fontId}`, {
      method: "DELETE",
    })
      .then(perserveStatus)
      .then((res) => {
        toast(res.json.message, {
          type: res.ok ? "success" : "error",
        });
      });

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
            mutateFonts();
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
      {bannerFonts?.length === 0 && (
        <Alert>No hay fuentes en el banner aún</Alert>
      )}
      <AppModal
        title="Delete font"
        open={openModal}
        setOpen={setModal}
        actions={
          <>
            <Button
              className="bg-green-500 text-white grid place-items-center"
              onPress={() =>
                handleDelete(fontId!).then(() => {
                  setModal(false);
                  mutateFonts();
                })
              }
            >
              Confirmar
            </Button>
            <Button
              className="bg-red-500 text-white grid place-items-center"
              onPress={() => setModal(false)}
            >
              Cancelar
            </Button>
          </>
        }
      >
        Estas seguro de querer eliminar esta fuente?
      </AppModal>
      <div>
        {isLoadingFonts && !bannerFonts && (
          <div className="flex items-center">
            <Spinner></Spinner>
            Cargando fuentes...
          </div>
        )}
        {bannerFonts?.map((font) => (
          <div className="flex" key={font.name}>
            <FontPreview fontName={font.name}></FontPreview>
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white p-1"
              onPress={() => {
                setModal(true);
                setFontId(font.id!);
                /*  */
              }}
            >
              <Image
                src={trashIcon}
                alt="Play"
                width={12}
                height={12}
                className="inline"
              ></Image>
            </Button>
            {isCompatible && (
              <Button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white p-1"
                onPress={() => {
                  toClipboard(font.name).then(() => {
                    toast.success("Copiado al portapapeles");
                  });
                }}
              >
                <Image
                  src={clipboardIcon}
                  alt="Play"
                  width={12}
                  height={12}
                  className="inline"
                ></Image>
              </Button>
            )}
          </div>
        ))}
      </div>

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
