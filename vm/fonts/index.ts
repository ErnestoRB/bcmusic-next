import { registerFont } from "canvas";
import { FONTS_PATH } from "./path";
import path from "path";

export interface BannerFont {
  nombre: string;
  fileName: string;
}

const registeredFonts: string[] = [];

export function registerBannerFont({ nombre, fileName }: BannerFont) {
  if (registeredFonts.find((font) => font === fileName)) return;
  const fontPath = path.join(FONTS_PATH, fileName);
  registerFont(fontPath, {
    family: nombre,
  });
  registeredFonts.push(fileName);
}
