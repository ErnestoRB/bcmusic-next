import { registerFont } from "canvas";
import { registerBannerFont } from "../../../vm/fonts";

jest.mock("canvas", () => {
  return {
    __esModule: true,
    registerFont: jest.fn(),
  };
});

describe("registerBannerFont()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls registerFont from 'canvas'", () => {
    registerBannerFont({ fileName: "algo", nombre: "algo" });
    expect(registerFont).toHaveBeenCalledTimes(1);
  });

  it("deosn't calls registerFont from 'canvas' when font has been already registered", () => {
    registerBannerFont({ fileName: "algo", nombre: "algo" });
    expect(registerFont).not.toHaveBeenCalled();
  });
});
