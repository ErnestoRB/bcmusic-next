import { Canvas, CanvasRenderingContext2D, Image } from "canvas";

export function bindMultilineSupport(canvas: Canvas) {
  const ctx = canvas.getContext("2d");
  const defaultLineHeight = 10;
  return function fillMultilineText(
    text: string,
    x: number,
    y: number,
    lineHeight: number = 1.0,
    textAlign: typeof CanvasRenderingContext2D.prototype.textAlign = "left",
    textBaseline: typeof CanvasRenderingContext2D.prototype.textBaseline = "middle"
  ) {
    const lines = text.split("\n");
    const measuredLines = lines.map((line) => {
      const measure = ctx.measureText(line);
      return {
        text: line,
        width: measure.width,
        height:
          measure.actualBoundingBoxDescent + measure.actualBoundingBoxAscent,
      };
    });
    let accumHeight = 0;
    ctx.save();
    const finalLineHeight = Math.max(
      defaultLineHeight * lineHeight,
      defaultLineHeight
    );
    const maxX = Math.max(...measuredLines.map((line) => line.width));
    const boundingHeight =
      measuredLines
        .map((line) => line.height)
        .reduce((pre, cur) => (pre += cur)) +
      finalLineHeight * (lines.length - 1);
    ctx.textAlign = textAlign;
    ctx.textBaseline = "top";

    measuredLines.forEach((line) => {
      const rX = textAlign == "center" ? x + maxX / 2 : x;
      const rY = textBaseline == "middle" ? y - boundingHeight / 2 : x;
      ctx.fillText(line.text, rX, rY + accumHeight);
      accumHeight += line.height + finalLineHeight;
    });
    ctx.restore();
  };
}

export function bindMeasureText(canvas: Canvas) {
  const ctx = canvas.getContext("2d");

  return function measureText(text: string) {
    const measure = ctx.measureText(text);
    return {
      height:
        measure.actualBoundingBoxDescent + measure.actualBoundingBoxAscent,
      width: measure.actualBoundingBoxLeft + measure.actualBoundingBoxRight,
    };
  };
}

export function bindDrawImage(canvas: Canvas) {
  const ctx = canvas.getContext("2d");
  return function draw(
    x: number,
    y: number,
    image: Image,
    width: number,
    height: number,
    shadow?: {
      shadowColor: CanvasRenderingContext2D["shadowColor"];
      shadowBlur: CanvasRenderingContext2D["shadowBlur"];
      shadowOffsetX: CanvasRenderingContext2D["shadowOffsetX"];
      shadowOffsetY: CanvasRenderingContext2D["shadowOffsetY"];
    }
  ) {
    ctx.save();
    if (shadow) {
      const { shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY } = shadow;
      ctx.shadowBlur = shadowBlur;
      ctx.shadowColor = shadowColor;
      ctx.shadowOffsetX = shadowOffsetX;
      ctx.shadowOffsetY = shadowOffsetY;
    }
    ctx.translate(x, y);
    ctx.scale(width / image.width, height / image.height);
    ctx.drawImage(image, 0, 0);
    ctx.restore();
  };
}

export function bindDrawRoundedImage(canvas: Canvas) {
  const context = canvas.getContext("2d");

  return function drawRoundedImage(
    image: Image,
    x: number,
    y: number,
    size: number,
    strokeStyle: string = "",
    lineWidth: number = 0
  ) {
    context.save();
    // create clipping region which will display portion of image
    // The image will only be visible inside the circular clipping path
    if (strokeStyle) {
      context.strokeStyle = strokeStyle;
    }
    context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    context.beginPath();
    context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    context.lineWidth = lineWidth;
    context.stroke();
    context.closePath();
    context.clip();
    // draw the image into the clipping region
    bindDrawImage(canvas)(x, y, image, size, size);
    // restore the context to its unaltered state
    context.restore();
  };
}
