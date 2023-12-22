import { useEffect, useState } from "react";
import { loadFontAsync } from "../../utils";
import { Spinner } from "../Spinner";
import Alert from "../Alert";

export interface IFontPreview {
  fontName: string;
  type?: "abc" | "name";
}

export default function FontPreview({ fontName, type = "name" }: IFontPreview) {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState<string | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (loading) return;
    if (fontName === loaded) return;
    setError(false);
    setLoading(true);
    loadFontAsync(fontName)
      .then((f) => {
        setLoaded(fontName);
        document.fonts.add(f);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [fontName, loading, loaded]);

  return (
    <div
      className="p-2 bg-stone-700  text-white text-md"
      style={{
        fontFamily: fontName,
      }}
    >
      {loading && <Spinner size="sm" />}
      {error && <Alert type="error">Error al cargar la fuente</Alert>}

      {loaded && type === "abc" && (
        <>
          <span>ABCDEFGHIJKLMNOPQRSTUVWXYZ</span>
          <br />
          <span
            style={{
              fontFamily: fontName,
            }}
          >
            abcdefghijklmnopqrstuvwxyz
          </span>
        </>
      )}
      {loaded && type === "name" && fontName}
    </div>
  );
}
