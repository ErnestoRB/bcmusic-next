import { Canvas, Image, loadImage as li, registerFont as rf } from "canvas";

declare global {
  var width: number;
  var height: number;
  var author: string;
  var description: string;
  var canvas: Canvas;
  var loadImage: typeof li;
  var registerFont: typeof rf;
  export interface SpotifyArtist {
    name: string;
  }
  class BannerError extends Error {
    isBanner: true;
  }
  var images: Image[];
  var data: SpotifyArtist[];
}
