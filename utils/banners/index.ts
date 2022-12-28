import { createCanvas, loadImage, registerFont } from "canvas";
import { readFile } from "fs/promises";
import path from "path";
import vm from "vm";
import { SpotifyArtist } from "../../types/definitions";
import bannerConfig, { BannerConfig } from "../validation/bannerConfig";

class BannerError extends Error {
  isBanner = true;
}

export default async function executeBanner(
  name: string,
  data: Partial<SpotifyArtist>[],
  basePath: string = process.cwd()
) {
  const configFile = await readFile(
    path.join(basePath, "designs", name + ".json"),
    "utf8"
  );
  const json = JSON.parse(configFile);
  const validatedJson = await bannerConfig.validateAsync(json);
  const script = await readFile(
    path.join(basePath, "designs", name + ".js"),
    "utf8"
  );
  const { width, height, author, description, images, fonts } =
    validatedJson as BannerConfig;
  fonts.forEach(({ src, family }) => {
    registerFont(path.join(basePath, "designs", "fonts", src), { family });
  });
  const promises = images.map((element) => {
    return loadImage(path.join(basePath, "designs", "images", element));
  });
  const imagesArray = await Promise.all(promises);
  const canvas = createCanvas(width, height);
  const context: any = {
    width,
    height,
    author,
    description,
    canvas,
    loadImage,
    registerFont,
    BannerError,
    images: imagesArray,
    data,
  };
  if (process.env.NODE_ENV === "test") {
    context.console = { log: console.log };
  }
  const buffer = vm.runInNewContext(script, context);
  return buffer;
}
