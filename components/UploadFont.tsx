import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { perserveStatus } from "../utils";
import { Button } from "./Button";
import { useRouter } from "next/router";

interface UploadFontProps {
  fontName?: string;
}

export default function UploadFont({ fontName }: UploadFontProps) {
  const { back } = useRouter();
  const [files, setFiles] = useState<File[]>();
  const [name, setName] = useState<string>(fontName ?? "");
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <form
      className="flex flex-col gap-y-2 max-w-md"
      onSubmit={(evt) => {
        evt.preventDefault();

        if (!files || files.length < 1) {
          toast("Por favor, agregar un archivo .ttf!", { type: "error" });
          return;
        }
        const data = new FormData();

        files?.forEach((file) => {
          data.append("font", file);
        });
        data.append("name", name);

        fetch(fontName ? `/api/font/${fontName}` : "/api/font", {
          body: data,
          method: fontName ? "PATCH" : "POST",
          credentials: "include",
        })
          .then(perserveStatus)
          .then((res) => {
            toast(res.json.message, { type: res.ok ? "success" : "error" });
            setName("");
            setFiles([]);
            fileRef.current!.value = "";
            back();
          });
      }}
    >
      <label htmlFor="name">Nombre de la fuente a usar en los banners</label>
      <input
        type="text"
        name="name"
        placeholder="Nombre de la fuente"
        value={name}
        disabled={!!fontName}
        onChange={(evt) => setName(evt.target.value)}
      />
      <label htmlFor="font">Archivo</label>
      <input
        type="file"
        name="font"
        accept=".ttf"
        id=""
        ref={fileRef}
        onChange={(evt) => setFiles(Array.from(evt.currentTarget.files!))}
      />
      <Button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        Guardar
      </Button>
    </form>
  );
}
