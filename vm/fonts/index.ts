import { registerFont } from "canvas";
import { FONTS_PATH } from "../../utils/paths";
import path from "path";

export interface BannerFont {
  name: string;
  fileName: string;
}

const registeredFonts: string[] = [];

export function registerBannerFont({ name: nombre, fileName }: BannerFont) {
  if (registeredFonts.find((font) => font === fileName)) return;
  const fontPath = path.join(FONTS_PATH, fileName);
  registerFont(fontPath, {
    family: nombre,
  });
  registeredFonts.push(fileName);
}
