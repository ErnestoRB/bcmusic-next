import { createCanvas, Image, loadImage, registerFont } from "canvas";
import { readFile, readdir } from "fs/promises";
import {
  bindDrawImage,
  bindMeasureText,
  bindMultilineSupport,
} from "./designs/utils";

import { User } from "next-auth";
import path from "path";
import { runInNewContext } from "vm";
import { SpotifyArtist } from "../../types/definitions";
import bannerConfig, { BannerConfig } from "../validation/bannerConfig";
import { isPromise } from "util/types";

class BannerError extends Error {
  isBanner = true;
}

export interface BannerConfigAndFile extends BannerConfig {
  file: string;
  fileName: string;
}

export default async function executeBanner(
  name: string,
  data: Partial<SpotifyArtist>[],
  user: User,
  basePath: string = process.cwd()
) {
  const configFile = await readFile(
    path.join(basePath, "designs", "list", name + ".json"),
    "utf8"
  );
  const json = JSON.parse(configFile);
  const validatedJson = await bannerConfig.validateAsync(json);
  const script = await readFile(
    path.join(basePath, "designs", "list", name + ".js"),
    "utf8"
  );
  const modifiedUser: { name: string; image?: Image } = { name: user.name! };
  if (user.image) {
    modifiedUser.image = await loadImage(user.image);
  }
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
    measureText: bindMeasureText(canvas),
    fillMultilineText: bindMultilineSupport(canvas),
    drawImage: bindDrawImage(canvas),
    BannerError,
    images: imagesArray,
    user: modifiedUser,
    data,
  };
  if (process.env.NODE_ENV === "test") {
    context.console = { log: console.log };
  }

  const promise = runInNewContext(script, context);
  if (!promise || !isPromise(promise)) return undefined;
  const buffer = await promise;
  if (!buffer || !(buffer instanceof Buffer)) return undefined;
  return buffer;
}

const bannerPath = path.join(
  process.cwd(),
  "utils",
  "banners",
  "designs",
  "list"
);

export async function getAvailableBanners() {
  try {
    const files = await readdir(bannerPath);
    const banners = files.filter(
      (file) => file !== "tsconfig.json" && file.match(/^.+\.json$/)
    );
    const data = await Promise.all(
      banners.map(async (file) => {
        const fileContents = await readFile(
          path.join(bannerPath, file),
          "utf-8"
        );
        const object = JSON.parse(fileContents);
        object.file = file;
        object.fileName = file.replace(".json", "");
        return object;
      })
    );

    return data as BannerConfigAndFile[];
  } catch (err) {
    console.error(err);
    return undefined;
  }
}
