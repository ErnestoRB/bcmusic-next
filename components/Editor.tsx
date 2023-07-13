import Editor, { useMonaco } from "@monaco-editor/react";
import monaco from "monaco-editor";
import { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import fetcher from "../utils/swr";
import useSWR from "swr";
import Alert from "./Alert";
import AddFont from "./AddFont";
import { Loading } from "./Loading";
import playIcon from "../images/play.svg";
import saveIcon from "../images/save-floppy-disk.svg";
import javascriptIcon from "../images/javascript.svg";

export interface EditorFileDescription {
  name: string;
  language: "javascript" | "typescript" | "json";
  value: string;
}

const files: EditorFileDescription[] = [
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
  const oldCode = useRef<string | undefined>();
  const actualCode = useRef<string | undefined>();

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
    if (data && data.data) {
      if (oldCode.current === undefined) {
        oldCode.current = data.data.script;
      }
      setEditorText(data.data.script);
    }
  }, [data]);

  useEffect(() => {
    if (!monaco) return;
    editorRef.current?.updateOptions({ fontFamily: "Inconsolata" });
    // compiler options
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      lib: ["es2015"], // ECMAScript but not DOM
      target: monaco.languages.typescript.ScriptTarget.ES2016,
      allowNonTsExtensions: true,
    });
    fetch("/index.d.ts") // DOM provided here
      .then((res) => res.text())
      .then((code) => {
        monaco.languages.typescript.javascriptDefaults.addExtraLib(
          code,
          "canvas"
        );
      })
      .then(() => fetch("/banner.d.ts")) // Sandbox definitions here
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
          <div>
            <div className="flex gap-x-2 p-2 bg-stone-800">
              <button
                className="bg-green-600 text-sm p-2  rounded-lg"
                onClick={() => {
                  if (editorText !== oldCode.current) {
                    toast(
                      "Tienes cambios sin guardar! Guarda antes de ejecutar el código",
                      {
                        type: "error",
                      }
                    );
                    return;
                  }
                  fetch(
                    "/api/banner/execute?" + new URLSearchParams({ id: id! }),
                    {
                      method: "POST",
                      // body: Add artists
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
                      oldCode.current = editorText;
                    });
                }}
              >
                <Image
                  src={saveIcon}
                  alt="Save code"
                  width={12}
                  height={12}
                  className="inline"
                ></Image>
              </button>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/5 w-full flex flex-row md:flex-col bg-stone-800 text-white">
                <div className="p-2">Archivos</div>
                {files.map((file, index) => (
                  <button
                    key={file.name}
                    className="bg-stone-900 h-8 gap-x-2 px-2 text-sm flex items-center"
                    onClick={() => setFileIndex(index)}
                  >
                    {file.language === "javascript" ? (
                      <Image
                        width={16}
                        height={16}
                        alt="Copy to clipboard icon"
                        src={javascriptIcon}
                      ></Image>
                    ) : null}
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
            {blob && (
              <>
                <div className="text-white flex flex-col w-full items-center bg-stone-800 p-4">
                  <h4 className="text-xl bg-transparent">
                    Resultado del script
                  </h4>
                  <div className="grid place-items-center max-w-md w-full box-content border-red-600 border-8 bg-white">
                    <img
                      src={blob}
                      alt="generated banner"
                      className="object-scale-down w-full"
                    ></img>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
      {isLoading && (
        <div className="w-ful flex justify-center">
          <Loading></Loading>
          Cargando...
        </div>
      )}
      {((data && !data.data) || (error && !isLoading)) && (
        <Alert>Ha ocurrido un error, lo sentimos. Intenta más tarde</Alert>
      )}
    </>
  );
}
