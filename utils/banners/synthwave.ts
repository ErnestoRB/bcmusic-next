import { createCanvas, loadImage, registerFont } from "canvas";
import { SpotifyArtist } from "../../types/definitions";
registerFont("./fonts/SF Movie Poster.ttf", { family: "SF Movie Poster" });
registerFont("./fonts/BLADRMF.ttf", { family: "Blade Runner Movie Font" });
const width = 1296;
const height = 1920;
const canvas = createCanvas(width, height);
const context = canvas.getContext("2d");

export async function createBannerBuffer(artistsData: SpotifyArtist[]) {
  const data = await loadImage("./images/background_text.jpg");
  if (artistsData.length < 1) {
    const error: Error & { isBanner?: boolean } = new Error(
      "No se tiene suficiente información de artistas para crear un banner!"
    );
    error.isBanner = true;
    throw error;
  }
  context.drawImage(data, 0, 0);
  let fontSize = 84;
  let dynamicY = 313;
  if (artistsData[0].name.length >= 20) {
    fontSize = 50;
    dynamicY = 330;
  }
  context.font = fontSize + 'pt "Blade Runner Movie Font"';
  context.textBaseline = "top";
  context.textAlign = "center";
  context.fillStyle = "#ffffff";
  context.fillText(artistsData[0].name.toLowerCase(), 648, dynamicY);
  context.font = '76pt "SF Movie Poster"';
  let y = 1610;
  let x = 648;
  let names = [];
  let string = "";
  for (let i = 1; i < 6 && i < artistsData.length; i++) {
    string += " " + artistsData[i].name + " ";
  }
  names[0] = string;
  string = "";
  for (let i_1 = 7; i_1 < 12 && i_1 < artistsData.length; i_1++) {
    string += " " + artistsData[i_1].name + " ";
  }
  names[1] = string;
  string = "";
  for (let i_2 = 13; i_2 < 19 && i_2 < artistsData.length; i_2++) {
    string += " " + artistsData[i_2].name + " ";
  }
  names[2] = string;
  for (let i_3 = 0; i_3 < names.length; i_3++) {
    context.fillText(names[i_3], x, y);
    y += 85;
  }
  return canvas.toBuffer("image/png");
}
