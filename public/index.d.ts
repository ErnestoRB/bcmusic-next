declare module "canvas" {
  interface CanvasRenderingContext2DSettings {
    alpha?: boolean;
    colorSpace?: PredefinedColorSpace;
    desynchronized?: boolean;
    willReadFrequently?: boolean;
  }
  
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasCaptureMediaStreamTrack) */
  interface CanvasCaptureMediaStreamTrack extends MediaStreamTrack {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasCaptureMediaStreamTrack/canvas) */
    readonly canvas: HTMLCanvasElement;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/APCI/CanvasCaptureMediaStreamTrack/requestFrame) */
    requestFrame(): void;
    addEventListener<K extends keyof MediaStreamTrackEventMap>(
      type: K,
      listener: (
        this: CanvasCaptureMediaStreamTrack,
        ev: MediaStreamTrackEventMap[K]
      ) => any,
      options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ): void;
    removeEventListener<K extends keyof MediaStreamTrackEventMap>(
      type: K,
      listener: (
        this: CanvasCaptureMediaStreamTrack,
        ev: MediaStreamTrackEventMap[K]
      ) => any,
      options?: boolean | EventListenerOptions
    ): void;
    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions
    ): void;
  }
  
  declare var CanvasCaptureMediaStreamTrack: {
    prototype: CanvasCaptureMediaStreamTrack;
    new (): CanvasCaptureMediaStreamTrack;
  };
  
  interface CanvasCompositing {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/globalAlpha) */
    globalAlpha: number;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation) */
    globalCompositeOperation: GlobalCompositeOperation;
  }
  
  interface CanvasDrawImage {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/drawImage) */
    drawImage(image: CanvasImageSource, dx: number, dy: number): void;
    drawImage(
      image: CanvasImageSource,
      dx: number,
      dy: number,
      dw: number,
      dh: number
    ): void;
    drawImage(
      image: CanvasImageSource,
      sx: number,
      sy: number,
      sw: number,
      sh: number,
      dx: number,
      dy: number,
      dw: number,
      dh: number
    ): void;
  }
  
  interface CanvasDrawPath {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/beginPath) */
    beginPath(): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/clip) */
    clip(fillRule?: CanvasFillRule): void;
    clip(path: Path2D, fillRule?: CanvasFillRule): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/fill) */
    fill(fillRule?: CanvasFillRule): void;
    fill(path: Path2D, fillRule?: CanvasFillRule): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/isPointInPath) */
    isPointInPath(x: number, y: number, fillRule?: CanvasFillRule): boolean;
    isPointInPath(
      path: Path2D,
      x: number,
      y: number,
      fillRule?: CanvasFillRule
    ): boolean;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/isPointInStroke) */
    isPointInStroke(x: number, y: number): boolean;
    isPointInStroke(path: Path2D, x: number, y: number): boolean;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/stroke) */
    stroke(): void;
    stroke(path: Path2D): void;
  }
  
  interface CanvasFillStrokeStyles {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/fillStyle) */
    fillStyle: string | CanvasGradient | CanvasPattern;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/strokeStyle) */
    strokeStyle: string | CanvasGradient | CanvasPattern;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/createConicGradient) */
    createConicGradient(startAngle: number, x: number, y: number): CanvasGradient;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/createLinearGradient) */
    createLinearGradient(
      x0: number,
      y0: number,
      x1: number,
      y1: number
    ): CanvasGradient;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/createPattern) */
    createPattern(
      image: CanvasImageSource,
      repetition: string | null
    ): CanvasPattern | null;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/createRadialGradient) */
    createRadialGradient(
      x0: number,
      y0: number,
      r0: number,
      x1: number,
      y1: number,
      r1: number
    ): CanvasGradient;
  }
  
  interface CanvasFilters {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/filter) */
    filter: string;
  }
  
  /**
   * An opaque object describing a gradient. It is returned by the methods CanvasRenderingContext2D.createLinearGradient() or CanvasRenderingContext2D.createRadialGradient().
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasGradient)
   */
  interface CanvasGradient {
    /**
     * Adds a color stop with the given color to the gradient at the given offset. 0.0 is the offset at one end of the gradient, 1.0 is the offset at the other end.
     *
     * Throws an "IndexSizeError" DOMException if the offset is out of range. Throws a "SyntaxError" DOMException if the color cannot be parsed.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasGradient/addColorStop)
     */
    addColorStop(offset: number, color: string): void;
  }
  
  declare var CanvasGradient: {
    prototype: CanvasGradient;
    new (): CanvasGradient;
  };
  
  interface CanvasImageData {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/createImageData) */
    createImageData(
      sw: number,
      sh: number,
      settings?: ImageDataSettings
    ): ImageData;
    createImageData(imagedata: ImageData): ImageData;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/getImageData) */
    getImageData(
      sx: number,
      sy: number,
      sw: number,
      sh: number,
      settings?: ImageDataSettings
    ): ImageData;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/putImageData) */
    putImageData(imagedata: ImageData, dx: number, dy: number): void;
    putImageData(
      imagedata: ImageData,
      dx: number,
      dy: number,
      dirtyX: number,
      dirtyY: number,
      dirtyWidth: number,
      dirtyHeight: number
    ): void;
  }
  
  interface CanvasImageSmoothing {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled) */
    imageSmoothingEnabled: boolean;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/imageSmoothingQuality) */
    imageSmoothingQuality: ImageSmoothingQuality;
  }
  
  interface CanvasPath {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/arc) */
    arc(
      x: number,
      y: number,
      radius: number,
      startAngle: number,
      endAngle: number,
      counterclockwise?: boolean
    ): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/arcTo) */
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/bezierCurveTo) */
    bezierCurveTo(
      cp1x: number,
      cp1y: number,
      cp2x: number,
      cp2y: number,
      x: number,
      y: number
    ): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/closePath) */
    closePath(): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/ellipse) */
    ellipse(
      x: number,
      y: number,
      radiusX: number,
      radiusY: number,
      rotation: number,
      startAngle: number,
      endAngle: number,
      counterclockwise?: boolean
    ): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineTo) */
    lineTo(x: number, y: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/moveTo) */
    moveTo(x: number, y: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/quadraticCurveTo) */
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/rect) */
    rect(x: number, y: number, w: number, h: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/roundRect) */
    roundRect(
      x: number,
      y: number,
      w: number,
      h: number,
      radii?: number | DOMPointInit | (number | DOMPointInit)[]
    ): void;
  }
  
  interface CanvasPathDrawingStyles {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineCap) */
    lineCap: CanvasLineCap;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineDashOffset) */
    lineDashOffset: number;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineJoin) */
    lineJoin: CanvasLineJoin;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineWidth) */
    lineWidth: number;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/miterLimit) */
    miterLimit: number;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/getLineDash) */
    getLineDash(): number[];
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash) */
    setLineDash(segments: number[]): void;
  }
  
  /**
   * An opaque object describing a pattern, based on an image, a canvas, or a video, created by the CanvasRenderingContext2D.createPattern() method.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasPattern)
   */
  interface CanvasPattern {
    /**
     * Sets the transformation matrix that will be used when rendering the pattern during a fill or stroke painting operation.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasPattern/setTransform)
     */
    setTransform(transform?: DOMMatrix2DInit): void;
  }
  
  declare var CanvasPattern: {
    prototype: CanvasPattern;
    new (): CanvasPattern;
  };
  
  interface CanvasRect {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/clearRect) */
    clearRect(x: number, y: number, w: number, h: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/fillRect) */
    fillRect(x: number, y: number, w: number, h: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/strokeRect) */
    strokeRect(x: number, y: number, w: number, h: number): void;
  }
  
  /**
   * The CanvasRenderingContext2D interface, part of the Canvas API, provides the 2D rendering context for the drawing surface of a <canvas> element. It is used for drawing shapes, text, images, and other objects.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D)
   */
  interface CanvasRenderingContext2D
    extends CanvasCompositing,
      CanvasDrawImage,
      CanvasDrawPath,
      CanvasFillStrokeStyles,
      CanvasFilters,
      CanvasImageData,
      CanvasImageSmoothing,
      CanvasPath,
      CanvasPathDrawingStyles,
      CanvasRect,
      CanvasShadowStyles,
      CanvasState,
      CanvasText,
      CanvasTextDrawingStyles,
      CanvasTransform,
      CanvasUserInterface {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/canvas) */
    readonly canvas: HTMLCanvasElement;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/getContextAttributes) */
    getContextAttributes(): CanvasRenderingContext2DSettings;
  }
  
  declare var CanvasRenderingContext2D: {
    prototype: CanvasRenderingContext2D;
    new (): CanvasRenderingContext2D;
  };
  
  interface CanvasShadowStyles {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/shadowBlur) */
    shadowBlur: number;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/shadowColor) */
    shadowColor: string;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/shadowOffsetX) */
    shadowOffsetX: number;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/shadowOffsetY) */
    shadowOffsetY: number;
  }
  
  interface CanvasState {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/reset) */
    reset(): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/restore) */
    restore(): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/save) */
    save(): void;
  }
  
  interface CanvasText {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/fillText) */
    fillText(text: string, x: number, y: number, maxWidth?: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/measureText) */
    measureText(text: string): TextMetrics;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/strokeText) */
    strokeText(text: string, x: number, y: number, maxWidth?: number): void;
  }
  
  interface CanvasTextDrawingStyles {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/direction) */
    direction: CanvasDirection;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/font) */
    font: string;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/fontKerning) */
    fontKerning: CanvasFontKerning;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/textAlign) */
    textAlign: CanvasTextAlign;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/textBaseline) */
    textBaseline: CanvasTextBaseline;
  }
  
  interface CanvasTransform {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/getTransform) */
    getTransform(): DOMMatrix;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/resetTransform) */
    resetTransform(): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/rotate) */
    rotate(angle: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/scale) */
    scale(x: number, y: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setTransform) */
    setTransform(
      a: number,
      b: number,
      c: number,
      d: number,
      e: number,
      f: number
    ): void;
    setTransform(transform?: DOMMatrix2DInit): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/transform) */
    transform(
      a: number,
      b: number,
      c: number,
      d: number,
      e: number,
      f: number
    ): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/translate) */
    translate(x: number, y: number): void;
  }
  
  interface CanvasUserInterface {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/drawFocusIfNeeded) */
    drawFocusIfNeeded(element: Element): void;
    drawFocusIfNeeded(path: Path2D, element: Element): void;
  }
  
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/ImageBitmapRenderingContext) */
  interface ImageBitmapRenderingContext {
    /** Returns the canvas element that the context is bound to. */
    readonly canvas: HTMLCanvasElement | OffscreenCanvas;
    /**
     * Transfers the underlying bitmap data from imageBitmap to context, and the bitmap becomes the contents of the canvas element to which context is bound.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/ImageBitmapRenderingContext/transferFromImageBitmap)
     */
    transferFromImageBitmap(bitmap: ImageBitmap | null): void;
  }
  
  declare var ImageBitmapRenderingContext: {
    prototype: ImageBitmapRenderingContext;
    new (): ImageBitmapRenderingContext;
  };
  
  
  /**
   * The underlying pixel data of an area of a <canvas> element. It is created using the ImageData() constructor or creator methods on the CanvasRenderingContext2D object associated with a canvas: createImageData() and getImageData(). It can also be used to set a part of the canvas by using putImageData().
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/ImageData)
   */
  interface ImageData {
      /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/ImageData/colorSpace) */
      readonly colorSpace: PredefinedColorSpace;
      /**
       * Returns the one-dimensional array containing the data in RGBA order, as integers in the range 0 to 255.
       *
       * [MDN Reference](https://developer.mozilla.org/docs/Web/API/ImageData/data)
       */
      readonly data: Uint8ClampedArray;
      /**
       * Returns the actual dimensions of the data in the ImageData object, in pixels.
       *
       * [MDN Reference](https://developer.mozilla.org/docs/Web/API/ImageData/height)
       */
      readonly height: number;
      /**
       * Returns the actual dimensions of the data in the ImageData object, in pixels.
       *
       * [MDN Reference](https://developer.mozilla.org/docs/Web/API/ImageData/width)
       */
      readonly width: number;
  }
  
  
  
  interface OffscreenCanvasEventMap {
      "contextlost": Event;
      "contextrestored": Event;
  }
  
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/OffscreenCanvas) */
  interface OffscreenCanvas extends EventTarget {
      /**
       * These attributes return the dimensions of the OffscreenCanvas object's bitmap.
       *
       * They can be set, to replace the bitmap with a new, transparent black bitmap of the specified dimensions (effectively resizing it).
       *
       * [MDN Reference](https://developer.mozilla.org/docs/Web/API/OffscreenCanvas/height)
       */
      height: number;
      oncontextlost: ((this: OffscreenCanvas, ev: Event) => any) | null;
      oncontextrestored: ((this: OffscreenCanvas, ev: Event) => any) | null;
      /**
       * These attributes return the dimensions of the OffscreenCanvas object's bitmap.
       *
       * They can be set, to replace the bitmap with a new, transparent black bitmap of the specified dimensions (effectively resizing it).
       *
       * [MDN Reference](https://developer.mozilla.org/docs/Web/API/OffscreenCanvas/width)
       */
      width: number;
      /**
       * Returns a promise that will fulfill with a new Blob object representing a file containing the image in the OffscreenCanvas object.
       *
       * The argument, if provided, is a dictionary that controls the encoding options of the image file to be created. The type field specifies the file format and has a default value of "image/png"; that type is also used if the requested type isn't supported. If the image format supports variable quality (such as "image/jpeg"), then the quality field is a number in the range 0.0 to 1.0 inclusive indicating the desired quality level for the resulting image.
       *
       * [MDN Reference](https://developer.mozilla.org/docs/Web/API/OffscreenCanvas/convertToBlob)
       */
      convertToBlob(options?: ImageEncodeOptions): Promise<Blob>;
      /**
       * Returns an object that exposes an API for drawing on the OffscreenCanvas object. contextId specifies the desired API: "2d", "bitmaprenderer", "webgl", or "webgl2". options is handled by that API.
       *
       * This specification defines the "2d" context below, which is similar but distinct from the "2d" context that is created from a canvas element. The WebGL specifications define the "webgl" and "webgl2" contexts. [WEBGL]
       *
       * Returns null if the canvas has already been initialized with another context type (e.g., trying to get a "2d" context after getting a "webgl" context).
       *
       * [MDN Reference](https://developer.mozilla.org/docs/Web/API/OffscreenCanvas/getContext)
       */
      getContext(contextId: "2d", options?: any): OffscreenCanvasRenderingContext2D | null;
      getContext(contextId: "bitmaprenderer", options?: any): ImageBitmapRenderingContext | null;
      getContext(contextId: "webgl", options?: any): WebGLRenderingContext | null;
      getContext(contextId: "webgl2", options?: any): WebGL2RenderingContext | null;
      getContext(contextId: OffscreenRenderingContextId, options?: any): OffscreenRenderingContext | null;
      /**
       * Returns a newly created ImageBitmap object with the image in the OffscreenCanvas object. The image in the OffscreenCanvas object is replaced with a new blank image.
       *
       * [MDN Reference](https://developer.mozilla.org/docs/Web/API/OffscreenCanvas/transferToImageBitmap)
       */
      transferToImageBitmap(): ImageBitmap;
      addEventListener<K extends keyof OffscreenCanvasEventMap>(type: K, listener: (this: OffscreenCanvas, ev: OffscreenCanvasEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
      addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
      removeEventListener<K extends keyof OffscreenCanvasEventMap>(type: K, listener: (this: OffscreenCanvas, ev: OffscreenCanvasEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
      removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
  }
  
  declare var OffscreenCanvas: {
      prototype: OffscreenCanvas;
      new(width: number, height: number): OffscreenCanvas;
  };
  
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/OffscreenCanvasRenderingContext2D) */
  interface OffscreenCanvasRenderingContext2D extends CanvasCompositing, CanvasDrawImage, CanvasDrawPath, CanvasFillStrokeStyles, CanvasFilters, CanvasImageData, CanvasImageSmoothing, CanvasPath, CanvasPathDrawingStyles, CanvasRect, CanvasShadowStyles, CanvasState, CanvasText, CanvasTextDrawingStyles, CanvasTransform {
      readonly canvas: OffscreenCanvas;
      /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/OffscreenCanvasRenderingContext2D/commit) */
      commit(): void;
  }
  
  declare var OffscreenCanvasRenderingContext2D: {
      prototype: OffscreenCanvasRenderingContext2D;
      new(): OffscreenCanvasRenderingContext2D;
  };
  
  
  /**
   * This Canvas 2D API interface is used to declare a path that can then be used on a CanvasRenderingContext2D object. The path methods of the CanvasRenderingContext2D interface are also present on this interface, which gives you the convenience of being able to retain and replay your path whenever desired.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Path2D)
   */
  interface Path2D extends CanvasPath {
      /**
       * Adds to the path the path given by the argument.
       *
       * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Path2D/addPath)
       */
      addPath(path: Path2D, transform?: DOMMatrix2DInit): void;
  }
  
  declare var Path2D: {
      prototype: Path2D;
      new(path?: Path2D | string): Path2D;
  };
  
  
  /**
   * The dimensions of a piece of text in the canvas, as created by the CanvasRenderingContext2D.measureText() method.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextMetrics)
   */
  interface TextMetrics {
      /**
       * Returns the measurement described below.
       *
       * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextMetrics/actualBoundingBoxAscent)
       */
      readonly actualBoundingBoxAscent: number;
      /**
       * Returns the measurement described below.
       *
       * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextMetrics/actualBoundingBoxDescent)
       */
      readonly actualBoundingBoxDescent: number;
      /**
       * Returns the measurement described below.
       *
       * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextMetrics/actualBoundingBoxLeft)
       */
      readonly actualBoundingBoxLeft: number;
      /**
       * Returns the measurement described below.
       *
       * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextMetrics/actualBoundingBoxRight)
       */
      readonly actualBoundingBoxRight: number;
      /**
       * Returns the measurement described below.
       *
       * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextMetrics/fontBoundingBoxAscent)
       */
      readonly fontBoundingBoxAscent: number;
      /**
       * Returns the measurement described below.
       *
       * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextMetrics/fontBoundingBoxDescent)
       */
      readonly fontBoundingBoxDescent: number;
      /**
       * Returns the measurement described below.
       *
       * [MDN Reference](https://developer.mozilla.org/docs/Web/API/TextMetrics/width)
       */
      readonly width: number;
  }
  
  declare var TextMetrics: {
      prototype: TextMetrics;
      new(): TextMetrics;
  };
  
  
  type CanvasDirection = "inherit" | "ltr" | "rtl";
  type CanvasFillRule = "evenodd" | "nonzero";
  type CanvasFontKerning = "auto" | "none" | "normal";
  type CanvasFontStretch = "condensed" | "expanded" | "extra-condensed" | "extra-expanded" | "normal" | "semi-condensed" | "semi-expanded" | "ultra-condensed" | "ultra-expanded";
  type CanvasFontVariantCaps = "all-petite-caps" | "all-small-caps" | "normal" | "petite-caps" | "small-caps" | "titling-caps" | "unicase";
  type CanvasLineCap = "butt" | "round" | "square";
  type CanvasLineJoin = "bevel" | "miter" | "round";
  type CanvasTextAlign = "center" | "end" | "left" | "right" | "start";
  type CanvasTextBaseline = "alphabetic" | "bottom" | "hanging" | "ideographic" | "middle" | "top";
  type CanvasTextRendering = "auto" | "geometricPrecision" | "optimizeLegibility" | "optimizeSpeed";
  
  type RenderingContext =
    | CanvasRenderingContext2D
    | ImageBitmapRenderingContext
    | WebGLRenderingContext
    | WebGL2RenderingContext;


  // NODE CANVAS
  export interface PngConfig {
    /** Specifies the ZLIB compression level. Defaults to 6. */
    compressionLevel?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    /**
     * Any bitwise combination of `PNG_FILTER_NONE`, `PNG_FILTER_SUB`,
     * `PNG_FILTER_UP`, `PNG_FILTER_AVG` and `PNG_FILTER_PATETH`; or one of
     * `PNG_ALL_FILTERS` or `PNG_NO_FILTERS` (all are properties of the canvas
     * instance). These specify which filters *may* be used by libpng. During
     * encoding, libpng will select the best filter from this list of allowed
     * filters. Defaults to `canvas.PNG_ALL_FILTERS`.
     */
    filters?: number;
    /**
     * _For creating indexed PNGs._ The palette of colors. Entries should be in
     * RGBA order.
     */
    palette?: Uint8ClampedArray;
    /**
     * _For creating indexed PNGs._ The index of the background color. Defaults
     * to 0.
     */
    backgroundIndex?: number;
    /** pixels per inch */
    resolution?: number;
  }

  export interface JpegConfig {
    /** Specifies the quality, between 0 and 1. Defaults to 0.75. */
    quality?: number;
    /** Enables progressive encoding. Defaults to `false`. */
    progressive?: boolean;
    /** Enables 2x2 chroma subsampling. Defaults to `true`. */
    chromaSubsampling?: boolean;
  }

  export interface PdfConfig {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creator?: string;
    creationDate?: Date;
    modDate?: Date;
  }

  export interface NodeCanvasRenderingContext2DSettings {
    alpha?: boolean;
    pixelFormat?: "RGBA32" | "RGB24" | "A8" | "RGB16_565" | "A1" | "RGB30";
  }

  export class Canvas {
    width: number;
    height: number;

    /** _Non standard._ The type of the canvas. */
    readonly type: "image" | "pdf" | "svg";

    /** _Non standard._ Getter. The stride used by the canvas. */
    readonly stride: number;

    /** Constant used in PNG encoding methods. */
    readonly PNG_NO_FILTERS: number;
    /** Constant used in PNG encoding methods. */
    readonly PNG_ALL_FILTERS: number;
    /** Constant used in PNG encoding methods. */
    readonly PNG_FILTER_NONE: number;
    /** Constant used in PNG encoding methods. */
    readonly PNG_FILTER_SUB: number;
    /** Constant used in PNG encoding methods. */
    readonly PNG_FILTER_UP: number;
    /** Constant used in PNG encoding methods. */
    readonly PNG_FILTER_AVG: number;
    /** Constant used in PNG encoding methods. */
    readonly PNG_FILTER_PAETH: number;

    constructor(width: number, height: number, type?: "image" | "pdf" | "svg");

    getContext(
      contextId: "2d",
      contextAttributes?: NodeCanvasRenderingContext2DSettings
    ): NodeCanvasRenderingContext2D;

    /**
     * For image canvases, encodes the canvas as a PNG. For PDF canvases,
     * encodes the canvas as a PDF. For SVG canvases, encodes the canvas as an
     * SVG.
     */
    toBuffer(cb: (err: Error | null, result: Buffer) => void): void;
    toBuffer(
      cb: (err: Error | null, result: Buffer) => void,
      mimeType: "image/png",
      config?: PngConfig
    ): void;
    toBuffer(
      cb: (err: Error | null, result: Buffer) => void,
      mimeType: "image/jpeg",
      config?: JpegConfig
    ): void;

    /**
     * For image canvases, encodes the canvas as a PNG. For PDF canvases,
     * encodes the canvas as a PDF. For SVG canvases, encodes the canvas as an
     * SVG.
     */
    toBuffer(): Buffer;
    toBuffer(mimeType: "image/png", config?: PngConfig): Buffer;
    toBuffer(mimeType: "image/jpeg", config?: JpegConfig): Buffer;
    toBuffer(mimeType: "application/pdf", config?: PdfConfig): Buffer;

    /**
     * Returns the unencoded pixel data, top-to-bottom. On little-endian (most)
     * systems, the array will be ordered BGRA; on big-endian systems, it will
     * be ARGB.
     */
    toBuffer(mimeType: "raw"): Buffer;

    createPNGStream(config?: PngConfig): PNGStream;
    createJPEGStream(config?: JpegConfig): JPEGStream;
    createPDFStream(config?: PdfConfig): PDFStream;

    /** Defaults to PNG image. */
    toDataURL(): string;
    toDataURL(mimeType: "image/png"): string;
    toDataURL(mimeType: "image/jpeg", quality?: number): string;
    /** _Non-standard._ Defaults to PNG image. */
    toDataURL(cb: (err: Error | null, result: string) => void): void;
    /** _Non-standard._ */
    toDataURL(
      mimeType: "image/png",
      cb: (err: Error | null, result: string) => void
    ): void;
    /** _Non-standard._ */
    toDataURL(
      mimeType: "image/jpeg",
      cb: (err: Error | null, result: string) => void
    ): void;
    /** _Non-standard._ */
    toDataURL(
      mimeType: "image/jpeg",
      config: JpegConfig,
      cb: (err: Error | null, result: string) => void
    ): void;
    /** _Non-standard._ */
    toDataURL(
      mimeType: "image/jpeg",
      quality: number,
      cb: (err: Error | null, result: string) => void
    ): void;
  }

  declare class NodeCanvasRenderingContext2D extends CanvasRenderingContext2D {
    /**
     * _Non-standard_. Defaults to 'good'. Affects pattern (gradient, image,
     * etc.) rendering quality.
     */
    patternQuality: "fast" | "good" | "best" | "nearest" | "bilinear";

    /**
     * _Non-standard_. Defaults to 'good'. Like `patternQuality`, but applies to
     * transformations affecting more than just patterns.
     */
    quality: "fast" | "good" | "best" | "nearest" | "bilinear";

    /**
     * Defaults to 'path'. The effect depends on the canvas type:
     *
     * * **Standard (image)** `'glyph'` and `'path'` both result in rasterized
     *   text. Glyph mode is faster than path, but may result in lower-quality
     *   text, especially when rotated or translated.
     *
     * * **PDF** `'glyph'` will embed text instead of paths into the PDF. This
     *   is faster to encode, faster to open with PDF viewers, yields a smaller
     *   file size and makes the text selectable. The subset of the font needed
     *   to render the glyphs will be embedded in the PDF. This is usually the
     *   mode you want to use with PDF canvases.
     *
     * * **SVG** glyph does not cause `<text>` elements to be produced as one
     *   might expect ([cairo bug](https://gitlab.freedesktop.org/cairo/cairo/issues/253)).
     *   Rather, glyph will create a `<defs>` section with a `<symbol>` for each
     *   glyph, then those glyphs be reused via `<use>` elements. `'path'` mode
     *   creates a `<path>` element for each text string. glyph mode is faster
     *   and yields a smaller file size.
     *
     * In glyph mode, `ctx.strokeText()` and `ctx.fillText()` behave the same
     * (aside from using the stroke and fill style, respectively).
     */
    textDrawingMode: "path" | "glyph";

    /** _Non-standard_. Sets the antialiasing mode. */
    antialias: "default" | "gray" | "none" | "subpixel";

    // Standard, but not in the TS lib and needs node-canvas class return type.
    /** Returns or sets a `DOMMatrix` for the current transformation matrix. */
    currentTransform: NodeCanvasDOMMatrix;

    // Standard, but need node-canvas class versions:
    getTransform(): NodeCanvasDOMMatrix;
    setTransform(
      a: number,
      b: number,
      c: number,
      d: number,
      e: number,
      f: number
    ): void;
    setTransform(transform?: NodeCanvasDOMMatrix): void;
    createImageData(sw: number, sh: number): NodeCanvasImageData;
    createImageData(imagedata: NodeCanvasImageData): NodeCanvasImageData;
    getImageData(
      sx: number,
      sy: number,
      sw: number,
      sh: number
    ): NodeCanvasImageData;
    putImageData(imagedata: NodeCanvasImageData, dx: number, dy: number): void;
    putImageData(
      imagedata: NodeCanvasImageData,
      dx: number,
      dy: number,
      dirtyX: number,
      dirtyY: number,
      dirtyWidth: number,
      dirtyHeight: number
    ): void;
    drawImage(image: Canvas | Image, dx: number, dy: number): void;
    drawImage(
      image: Canvas | Image,
      dx: number,
      dy: number,
      dw: number,
      dh: number
    ): void;
    drawImage(
      image: Canvas | Image,
      sx: number,
      sy: number,
      sw: number,
      sh: number,
      dx: number,
      dy: number,
      dw: number,
      dh: number
    ): void;
    /**
     * **Do not use this overload. Use one of the other three overloads.** This
     * is a catch-all definition required for compatibility with the base
     * `CanvasRenderingContext2D` interface.
     */
    drawImage(...args: any[]): void;
    createPattern(
      image: Canvas | Image,
      repetition: "repeat" | "repeat-x" | "repeat-y" | "no-repeat" | "" | null
    ): NodeCanvasCanvasPattern;
    /**
     * **Do not use this overload. Use the other three overload.** This is a
     * catch-all definition required for compatibility with the base
     * `CanvasRenderingContext2D` interface.
     */
    createPattern(...args: any[]): NodeCanvasCanvasPattern;
    createLinearGradient(
      x0: number,
      y0: number,
      x1: number,
      y1: number
    ): NodeCanvasCanvasGradient;
    createRadialGradient(
      x0: number,
      y0: number,
      r0: number,
      x1: number,
      y1: number,
      r1: number
    ): NodeCanvasCanvasGradient;

    /**
     * For PDF canvases, adds another page. If width and/or height are omitted,
     * the canvas's initial size is used.
     */
    addPage(width?: number, height?: number): void;
  }
  export { NodeCanvasRenderingContext2D as CanvasRenderingContext2D };

  declare class NodeCanvasCanvasGradient extends CanvasGradient {}
  export { NodeCanvasCanvasGradient as CanvasGradient };

  declare class NodeCanvasCanvasPattern extends CanvasPattern {}
  export { NodeCanvasCanvasPattern as CanvasPattern };

  // This does not extend HTMLImageElement because there are dozens of inherited
  // methods and properties that we do not provide.
  export class Image {
    /** Track image data */
    static readonly MODE_IMAGE: number;
    /** Track MIME data */
    static readonly MODE_MIME: number;

    /**
     * The URL, `data:` URI or local file path of the image to be loaded, or a
     * Buffer instance containing an encoded image.
     */
    src: string | Buffer;
    /** Retrieves whether the object is fully loaded. */
    readonly complete: boolean;
    /** Sets or retrieves the height of the image. */
    height: number;
    /** Sets or retrieves the width of the image. */
    width: number;

    /** The original height of the image resource before sizing. */
    readonly naturalHeight: number;
    /** The original width of the image resource before sizing. */
    readonly naturalWidth: number;
    /**
     * Applies to JPEG images drawn to PDF canvases only. Setting
     * `img.dataMode = Image.MODE_MIME` or `Image.MODE_MIME|Image.MODE_IMAGE`
     * enables image MIME data tracking. When MIME data is tracked, PDF canvases
     * can embed JPEGs directly into the output, rather than re-encoding into
     * PNG. This can drastically reduce filesize and speed up rendering.
     */
    dataMode: number;

    onload: (() => void) | null;
    onerror: ((err: Error) => void) | null;
  }

  /**
   * Creates a Canvas instance. This function works in both Node.js and Web
   * browsers, where there is no Canvas constructor.
   * @param type Optionally specify to create a PDF or SVG canvas. Defaults to an
   * image canvas.
   */
  export function createCanvas(
    width: number,
    height: number,
    type?: "pdf" | "svg"
  ): Canvas;

  /**
   * Creates an ImageData instance. This function works in both Node.js and Web
   * browsers.
   * @param data An array containing the pixel representation of the image.
   * @param height If omitted, the height is calculated based on the array's size
   * and `width`.
   */
  export function createImageData(
    data: Uint8ClampedArray,
    width: number,
    height?: number
  ): ImageData;
  /**
   * _Non-standard._ Creates an ImageData instance for an alternative pixel
   * format, such as RGB16_565
   * @param data An array containing the pixel representation of the image.
   * @param height If omitted, the height is calculated based on the array's size
   * and `width`.
   */
  export function createImageData(
    data: Uint16Array,
    width: number,
    height?: number
  ): ImageData;
  /**
   * Creates an ImageData instance. This function works in both Node.js and Web
   * browsers.
   */
  export function createImageData(width: number, height: number): ImageData;

  /**
   * Convenience function for loading an image with a Promise interface. This
   * function works in both Node.js and Web browsers; however, the `src` must be
   * a string in Web browsers (it can only be a Buffer in Node.js).
   * @param src URL, `data: ` URI or (Node.js only) a local file path or Buffer
   * instance.
   */
  export function loadImage(
    src: string | Buffer,
    options?: any
  ): Promise<Image>;

  /**
   * Registers a font that is not installed as a system font. This must be used
   * before creating Canvas instances.
   * @param path Path to local font file.
   * @param fontFace Description of the font face, corresponding to CSS properties
   * used in `@font-face` rules.
   */
  export function registerFont(
    path: string,
    fontFace: { family: string; weight?: string; style?: string }
  ): void;

  /**
   * Unloads all fonts
   */
  export function deregisterAllFonts(): void;

  /** This class must not be constructed directly; use `canvas.createPNGStream()`. */
  export class PNGStream extends Readable {}
  /** This class must not be constructed directly; use `canvas.createJPEGStream()`. */
  export class JPEGStream extends Readable {}
  /** This class must not be constructed directly; use `canvas.createPDFStream()`. */
  export class PDFStream extends Readable {}

  declare class NodeCanvasDOMMatrix extends DOMMatrix {}
  export { NodeCanvasDOMMatrix as DOMMatrix };

  declare class NodeCanvasDOMPoint extends DOMPoint {}
  export { NodeCanvasDOMPoint as DOMPoint };

  declare class NodeCanvasImageData extends ImageData {}
  export { NodeCanvasImageData as ImageData };

  // This is marked private, but is exported...
  // export function parseFont(description: string): object

  // Not documented: backends

  /** Library version. */
  export const version: string;
  /** Cairo version. */
  export const cairoVersion: string;
  /** jpeglib version, if built with JPEG support. */
  export const jpegVersion: string | undefined;
  /** giflib version, if built with GIF support. */
  export const gifVersion: string | undefined;
  /** freetype version. */
  export const freetypeVersion: string;
  /** rsvg version. */
  export const rsvgVersion: string | undefined;
}
