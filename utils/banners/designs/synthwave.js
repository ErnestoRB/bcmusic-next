const context = canvas.getContext("2d");
if (data.length < 1) {
  throw new BannerError(
    "No se tiene suficiente información de artistas para crear un banner!"
  );
}
context.drawImage(images[0], 0, 0);
let fontSize = 84;
let dynamicY = 313;
if (data[0].name.length >= 20) {
  fontSize = 50;
  dynamicY = 330;
}
context.font = fontSize + 'pt "Blade Runner Movie Font"';
context.textBaseline = "top";
context.textAlign = "center";
context.fillStyle = "#ffffff";
context.fillText(data[0].name.toLowerCase(), 648, dynamicY);
context.font = '76pt "SF Movie Poster"';
let y = 1610;
let x = 648;
let names = [];
let string = "";
for (let i = 1; i < 6 && i < data.length; i++) {
  string += " " + data[i].name + " ";
}
names[0] = string;
string = "";
for (let i_1 = 7; i_1 < 12 && i_1 < data.length; i_1++) {
  string += " " + data[i_1].name + " ";
}
names[1] = string;
string = "";
for (let i_2 = 13; i_2 < 19 && i_2 < data.length; i_2++) {
  string += " " + data[i_2].name + " ";
}
names[2] = string;
for (let i_3 = 0; i_3 < names.length; i_3++) {
  context.fillText(names[i_3], x, y);
  y += 85;
}
canvas.toBuffer("image/png");
