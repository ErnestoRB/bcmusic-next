import { toast } from "react-toastify";

export function useClipboard() {
  const isCompatible = !!navigator.clipboard;
  const toClipboard = async (text: string) => {
    if (!isCompatible) {
      return showNotCompatible();
    }
    await navigator.clipboard.writeText(text);
  };

  const readClipboard = async () => {
    if (!isCompatible) {
      showNotCompatible();
      return null;
    }
    return await navigator.clipboard.readText();
  };

  const showNotCompatible = () => {
    toast.error("No se puede usar esta funcionalidad en tu dispositivo :( ");
  };

  return { isCompatible, toClipboard, readClipboard };
}
