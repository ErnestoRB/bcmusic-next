import { createCanvas, Image, loadImage, registerFont } from "canvas";
import { isPromise } from "util/types";
import { NodeVM } from "vm2";
import { SpotifyArtist } from "../../types/definitions";
import { BannerError } from "..";
import {
  bindDrawImage,
  bindDrawRoundedImage,
  bindMeasureText,
  bindMultilineSupport,
} from "./utils";
import { runInNewContext } from "vm";
import { ScriptReturn } from "../validation/vm";
import path from "path";
import { FONTS_PATH } from "./path";

export async function executeBanner(
  script: string,
  size: { width: number; height: number },
  images: Image[],
  artists: Pick<SpotifyArtist, "name" | "images">[],
  fonts?: { nombre: string; fileName: string }[]
): Promise<Buffer | undefined> {
  const { width, height } = size;
  if (fonts) {
    fonts.forEach((font) => {
      const fontPath = path.join(FONTS_PATH, font.fileName);

      registerFont(fontPath, {
        family: font.nombre,
      });
    });
  }
  const canvas = createCanvas(width, height);

  const context = {
    canvas,
    images,
    width,
    height,
    data: artists,
    BannerError,
    loadImage,
    measureText: bindMeasureText(canvas),
    fillMultilineText: bindMultilineSupport(canvas),
    drawImage: bindDrawImage(canvas),
    drawRoundedImage: bindDrawRoundedImage(canvas),
    console: { log: console.log },
  };

  let returned = runInNewContext(
    `
  const vm = new NodeVM({ sandbox: context, wrapper: "none" });
  vm.run(script);
  `,
    { NodeVM, context, script },
    { timeout: 5000 }
  );
  returned = await ScriptReturn.validateAsync(returned, {
    convert: false,
    messages: { "custom.promise": "El resultado no es una promesa" },
  });

  if (Buffer.isBuffer(returned)) {
    return returned;
  } else {
    if (typeof returned === "function") {
      const result = returned();
      if (isPromise(result)) {
        result.then((awaitedResult) => {
          console.log(awaitedResult);
          return awaitedResult;
        });
      } else {
        return result;
      }
    } else {
      return returned;
    }
  }
  return undefined;
}
