import Editor, { useMonaco } from "@monaco-editor/react";
import monaco from "monaco-editor";
import { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import playIcon from "../images/play.svg";
import fetcher from "../utils/swr";
import useSWR from "swr";
import Alert from "./Alert";
import AddFont from "./AddFont";

const files = [
  {
    name: "script.js",
    language: "javascript",
    value: "someJSCodeExample",
  },
];

type OnMount = (editor: monaco.editor.IStandaloneCodeEditor) => void;

export default function BannerEditor({ id }: { id: string }) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [editorText, setEditorText] = useState("");
  const [response, setResponse] = useState<
    { message: string; data?: string } | undefined
  >(undefined);
  const [blob, setBlob] = useState<string | undefined>(undefined);
  const [fileIndex, setFileIndex] = useState(0);

  const monaco = useMonaco();

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const file = files[fileIndex];

  const { data, error, isLoading } = useSWR(
    `/api/banner/${id}?script=true`,
    fetcher
  );

  useEffect(() => {
    if (data) {
      setEditorText(data.data?.script);
    }
  }, [data]);

  useEffect(() => {
    if (!monaco) return;
    // compiler options
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2016,
      allowNonTsExtensions: true,
    });
    fetch("/index.d.ts")
      .then((res) => res.text())
      .then((code) => {
        monaco.languages.typescript.javascriptDefaults.addExtraLib(
          code,
          "canvas"
        );
      })
      .then(() => fetch("/banner.d.ts"))
      .then((res) => res.text())
      .then((code) => {
        monaco.languages.typescript.javascriptDefaults.addExtraLib(
          code,
          "banner.d.ts"
        );
      });
  }, [monaco]);

  useEffect(() => {
    if (response && response.data && typeof response.data === "string") {
      setBlob(`data:image/png;base64,${response.data}`);
    } else {
      setBlob(undefined);
    }
  }, [response]);

  return (
    <>
      {data && data.data && !error && !isLoading && (
        <>
          <h1 className="font-bold text-4xl my-4">
            Banner {`"${data.data?.name}"`}
          </h1>
          <AddFont id={id} bannerFonts={data.data.fonts}></AddFont>
          <div className="flex gap-x-2 p-2 bg-stone-800">
            <button
              className="bg-green-400 text-sm p-2  rounded-lg"
              onClick={() => {
                fetch(
                  "/api/banner/execute?" + new URLSearchParams({ id: id! }),
                  {
                    method: "POST",
                    body: editorRef.current?.getValue(),
                  }
                )
                  .then((res) => res.json())
                  .then((response) => {
                    toast(response.message, {
                      type: response.data ? "success" : "error",
                      position: "bottom-right",
                    });
                    setResponse(response);
                  });
              }}
            >
              Correr{" "}
              <Image
                src={playIcon}
                alt="Play"
                width={12}
                height={12}
                className="inline"
              ></Image>
            </button>
            <button
              className="bg-blue-600 text-white text-sm p-2  rounded-lg"
              onClick={() => {
                if (!id) {
                  toast("Aún no estableces los datos del banner!", {
                    type: "error",
                  });
                  return;
                }
                fetch("/api/banner/" + id, {
                  method: "PATCH",
                  body: JSON.stringify({
                    script: editorRef.current?.getValue(),
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                })
                  .then((res) => res.json())
                  .then((response) => {
                    toast(response.message, { type: "success" });
                  });
              }}
            >
              Guardar{" "}
            </button>
          </div>
          <div className="flex">
            <div className="w-1/5 flex flex-col bg-stone-800">
              {files.map((file, index) => (
                <button
                  key={file.name}
                  className="bg-stone-900 h-8 text-white px-2 text-sm flex items-center"
                  onClick={() => setFileIndex(index)}
                >
                  {file.name}
                </button>
              ))}
            </div>
            <Editor
              height="500px"
              path={file.name}
              defaultLanguage={file.language}
              onMount={handleEditorDidMount}
              value={editorText}
            />
          </div>
          <div className="flex w-full justify-center bg-stone-800 p-4">
            {blob && (
              <div className="max-w-md w-full box-content border-red-600 border-8 bg-white">
                <img
                  src={blob}
                  alt="generated banner"
                  className="object-scale-down w-full"
                ></img>
              </div>
            )}
          </div>
        </>
      )}
      {isLoading && <div>Cargando...</div>}
      {((data && !data.data) || (error && !isLoading)) && (
        <Alert>Ha ocurrido un error, lo sentimos. Intenta más tarde</Alert>
      )}
    </>
  );
}
