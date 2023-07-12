import { Canvas, createCanvas, loadImage } from "canvas";
import { SpotifyArtist } from "../types/definitions";
import {
  bindDrawImage,
  bindDrawRoundedImage,
  bindMeasureText,
  bindMultilineSupport,
} from "./utils";
import { BannerError } from "../utils";

export type BannerArtist = Pick<SpotifyArtist, "name" | "images">;

export interface BannerContext {
  canvas: Canvas;
  images: string[];
  width: number;
  height: number;
  BannerError: typeof BannerError;
  data: BannerArtist[];
  loadImage: typeof loadImage;
  measureText: ReturnType<typeof bindMeasureText>;
  fillMultilineText: ReturnType<typeof bindMultilineSupport>;
  drawImage: ReturnType<typeof bindDrawImage>;
  drawRoundedImage: ReturnType<typeof bindDrawRoundedImage>;
}

export function createBannerContext(
  width: number,
  height: number,
  data: BannerArtist[],
  images: string[] = []
): BannerContext {
  const canvas = createCanvas(width, height);

  const context = {
    canvas,
    images,
    width,
    height,
    data,
    BannerError,
    loadImage,
    measureText: bindMeasureText(canvas),
    fillMultilineText: bindMultilineSupport(canvas),
    drawImage: bindDrawImage(canvas),
    drawRoundedImage: bindDrawRoundedImage(canvas),
    console: { log: console.log },
  };

  return context;
}
