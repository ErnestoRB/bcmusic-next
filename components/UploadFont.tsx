import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { perserveStatus } from "../utils";

export default function UploadFont() {
  const [files, setFiles] = useState<File[]>();
  const [name, setName] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <form
        className="flex flex-col gap-y-2"
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

          fetch("/api/fonts", {
            body: data,
            method: "POST",
            credentials: "include",
          })
            .then(perserveStatus)
            .then((res) => {
              toast(res.json.message, { type: res.ok ? "success" : "error" });
              setName("");
              setFiles([]);
              fileRef.current!.value = "";
            });
        }}
      >
        <label htmlFor="font">Archivo</label>
        <input
          type="file"
          name="font"
          accept=".ttf"
          id=""
          ref={fileRef}
          onChange={(evt) => setFiles(Array.from(evt.currentTarget.files!))}
        />
        <label htmlFor="name">Nombre de la fuente a usar en los banners</label>
        <input
          type="text"
          name="name"
          placeholder="Nombre de la fuente"
          value={name}
          onChange={(evt) => setName(evt.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}
