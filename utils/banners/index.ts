import { createCanvas, Image, loadImage, registerFont } from "canvas";
import { BannerError } from "..";
import { readFile, readdir } from "fs/promises";
import {
  bindDrawImage,
  bindDrawRoundedImage,
  bindMeasureText,
  bindMultilineSupport,
} from "./designs/utils";

import { User } from "next-auth";
import path from "path";
import { runInNewContext } from "vm";
import { SpotifyArtist } from "../../types/definitions";
import bannerConfig, { BannerConfig } from "../validation/bannerConfig";
import { isPromise } from "util/types";

export interface BannerConfigAndFile extends BannerConfig {
  file: string;
  fileName: string;
}

export interface SanboxedPlayer {
  name: string;
  image?: Image;
}

export type FilteredArtistsData = Pick<SpotifyArtist, "name" | "images">;

const bannerPath = path.join(process.cwd(), "utils", "banners", "designs");
const bannerCode = path.join(bannerPath, "list");

export async function bannerExists(bannerFile: string): Promise<boolean> {
  try {
    return !!(await getBannerConfig(bannerFile, bannerCode));
  } catch (err) {
    return false;
  }
}

/**
 * Obtiene la configuración del banner
 * @param bannerFile Nombre del archivo (sin extensión)
 * @param basePath Ruta base de donde buscar el archivo
 * @returns {BannerConfigAndFile}
 * @throws Cuando no se encuentra una configuración válida
 */
export async function getBannerConfig(
  bannerFile: string,
  basePath: string = bannerCode
): Promise<BannerConfigAndFile> {
  try {
    const configFile = await readFile(
      path.join(basePath, bannerFile + ".json"),
      "utf8"
    );
    const json = JSON.parse(configFile);
    const validatedConfig = await bannerConfig.validateAsync(json);
    validatedConfig.file = bannerFile;
    validatedConfig.fileName = bannerFile.replace(".json", "");
    return validatedConfig;
  } catch (error: any) {
    throw new BannerError(
      `Problema al cargar el banner ${bannerFile}: ${error}`
    );
  }
}

export default async function executeBanner(
  name: string,
  data: SpotifyArtist[] | FilteredArtistsData[],
  user: User,
  basePath: string = bannerPath
) {
  const script = await readFile(
    path.join(basePath, "list", name + ".js"),
    "utf8"
  );
  const modifiedUser = await getSanboxedPlayer(user);
  const filteredData = await filterArtistsData(data);
  const { width, height, author, description, images, fonts } =
    await getBannerConfig(name);
  fonts.forEach(({ src, family }) => {
    registerFont(path.join(basePath, "fonts", src), { family });
  });
  const promises = images.map((element) => {
    return loadImage(path.join(basePath, "images", element));
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
    drawRoundedImage: bindDrawRoundedImage(canvas),
    BannerError,
    images: imagesArray,
    user: modifiedUser,
    data: filteredData,
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

/**
 * @returns Las configuraciones de todos los banners encontrados
 */
export async function getAvailableBanners(basePath = bannerCode) {
  try {
    const files = await readdir(basePath);
    const banners = files.filter(
      (file) => file !== "tsconfig.json" && file.match(/^.+\.json$/)
    );
    const data = await Promise.all(
      banners.map(async (file) => {
        const fileContents = await readFile(path.join(basePath, file), "utf-8");
        try {
          const object = await bannerConfig.validateAsync(
            JSON.parse(fileContents)
          );
          object.file = file;
          object.fileName = file.replace(".json", "");
          return object;
        } catch (error) {
          return undefined;
        }
      })
    );
    return data.filter((data) => data != undefined) as BannerConfigAndFile[];
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export async function getSanboxedPlayer(user: User & { [key: string]: any }) {
  const modifiedUser: SanboxedPlayer = { name: user.name! };
  if (user.image) {
    try {
      modifiedUser.image = await loadImage(user.image);
    } catch (error) {}
  }
  return modifiedUser;
}

export async function filterArtistsData(
  data: SpotifyArtist[] | FilteredArtistsData[]
): Promise<FilteredArtistsData[]> {
  return data.map((artist) => ({ name: artist.name, images: artist.images }));
}
