import { createCanvas } from "canvas";
import { createBannerContext } from "../../vm/context";

jest.mock("canvas", () => {
  return {
    __esModule: true,
    createCanvas: jest.fn(() => ({})),
    loadImage: jest.fn(),
  };
});

jest.mock("../../vm/utils", () => ({
  bindMultilineSupport: jest.fn().mockReturnValue({}),
  bindMeasureText: jest.fn().mockReturnValue({}),
  bindDrawImage: jest.fn().mockReturnValue({}),
  bindDrawRoundedImage: jest.fn().mockReturnValue({}),
}));

describe("createBannerContext()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a canvas", () => {
    createBannerContext(100, 100, []);
    expect(createCanvas).toHaveBeenCalledTimes(1);
  });
  it("creates a new context", () => {
    const ctx = createBannerContext(100, 100, []);
    expect(ctx).toBeDefined();
    expect(ctx.BannerError).toBeDefined();
    expect(ctx.canvas).toBeDefined();
    expect(ctx.loadImage).toBeDefined();
    expect(ctx.drawImage).toBeDefined();
    expect(ctx.drawRoundedImage).toBeDefined();
    expect(ctx.fillMultilineText).toBeDefined();
    expect(ctx.width).toBe(100);
    expect(ctx.height).toBe(100);
    expect(ctx.data).toEqual([]);
    expect(ctx.images).toEqual([]);
  });
});
