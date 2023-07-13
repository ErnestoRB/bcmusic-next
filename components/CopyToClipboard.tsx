import Image from "next/image";
import copyIcon from "../images/content-copy.svg";
import { toast } from "react-toastify";

export function CopyToClipboards({ children }: { children: string }) {
  if (!children) {
    throw new Error("No text was passed");
  }

  return (
    <div className="flex items-center shadow-inner bg-stone-100 w-max rounded-md pl-4 gap-x-2">
      <span className="block ">{children}</span>
      <button
        className="rounded-md bg-rose-500"
        onClick={() => {
          if (window.navigator?.clipboard) {
            window.navigator.clipboard.writeText(children);
            toast("Copiado al portapapeles", {
              type: "success",
            });
          }
        }}
      >
        <Image
          width={16}
          height={16}
          alt="Copy to clipboard icon"
          src={copyIcon}
        ></Image>
      </button>
    </div>
  );
}
