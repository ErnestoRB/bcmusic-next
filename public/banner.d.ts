import { Canvas, Image, loadImage as li, registerFont as rf } from "canvas";

interface SpotifyArtist {
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  name: string;
}

declare global {
  var width: number;
  var height: number;
  var user: {
    name: string;
    image?: Image;
  };
  var description: string;
  var canvas: Canvas;
  var loadImage: typeof li;
  var data: SpotifyArtist[];
  var numeros: Array<number>;

  class BannerError extends Error {
    isBanner: true;
  }
}
