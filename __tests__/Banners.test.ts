import { join } from "path";
import executeBanner from "../utils/banners/index";

const basePath = join(process.cwd(), "utils", "banners");
const user = { name: "Ernesto", id: "123" };

JSON.parse = jest.fn().mockReturnValue({
  width: 1,
  height: 1,
  author: "Testing",
  name: "Genial",
  images: [],
  fonts: [],
});

jest.mock("fs/promises", () => {
  const originalModule: any = jest.requireActual("fs/promises");

  return {
    __esModule: true,
    ...originalModule,
    readFile: async () => "",
  };
});

jest.mock("vm", () => {
  const originalModule: any = jest.requireActual("vm");

  return {
    __esModule: true,
    ...originalModule,
    runInNewContext: async () => Buffer.from([0x00]),
  };
});

jest.mock("canvas", () => {
  const originalModule: any = jest.requireActual("canvas");
  const img = new originalModule.Image();
  img.src = "tests/react.png";
  return {
    __esModule: true,
    ...originalModule,
    loadImage: async () => img,
  };
});

describe("Banner creation", () => {
  describe("VM environment", () => {
    it("Should return buffer instance on successful banner name", async () => {
      const result = await executeBanner(
        "synthwave",
        [{ name: "hola" }],
        user,
        basePath
      );
      expect(result).toBeInstanceOf(Buffer);
    });
  });
});
