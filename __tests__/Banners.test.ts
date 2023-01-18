import { loadImage } from "canvas";
import { readdir, readFile } from "fs/promises";
import {
  getAvailableBanners,
  getBannerConfig,
  getSanboxedPlayer,
} from "../utils/banners/index";

const user = { name: "Ernesto", id: "123" };

jest.mock("fs/promises");

jest.mock("vm");

jest.mock("canvas", () => {
  const originalModule: any = jest.requireActual("canvas");
  const img = new originalModule.Image();
  img.src = "tests/react.png";
  return {
    __esModule: true,
    ...originalModule,
    loadImage: jest.fn().mockImplementation(async () => img),
  };
});

describe("Banner creation", () => {
  describe("getAvailableBanners", () => {
    it("doesn't return anything when config isn't well written", async () => {
      (readdir as jest.Mock).mockImplementation(async () => [
        "first.json",
        "second.json",
      ]);
      (readFile as jest.Mock).mockImplementation(async () =>
        JSON.stringify({ algo: 1 })
      );
      const result = await getAvailableBanners();
      expect(result.length).toBe(0);
    });
    it("works", async () => {
      (readdir as jest.Mock).mockImplementation(async () => ["synthwave.json"]);
      (readFile as jest.Mock).mockImplementation(
        async () =>
          `{
          "width": 1296,
          "height": 1920,
          "author": "Iker Jiménez",
          "name": "Synthwave",
          "time_range": "long_term",
          "example": "https://i.imgur.com/aD4WkXl.png",
          "fonts": [
            { "src": "SF Movie Poster.ttf", "family": "SF Movie Poster" },
            { "src": "BLADRMF.ttf", "family": "Blade Runner Movie Font" }
          ],
          "images": ["background_text.jpg", "background.jpg"]
        }
        `
      );
      const result = await getAvailableBanners();
      expect(result[0].fileName).toMatch("synthwave");
      expect(result[0].author).toMatch("Iker Jiménez");
    });
  });

  describe("getBannerConfig", () => {
    it("throws when error occurred internally", async () => {
      (readFile as jest.Mock).mockImplementation(async () => {
        throw new Error("Failed");
      });
      try {
        await getBannerConfig("hola");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
    it("works", async () => {
      (readFile as jest.Mock).mockImplementation(
        async () =>
          `{
          "width": 1296,
          "height": 1920,
          "author": "Iker Jiménez",
          "name": "Synthwave",
          "time_range": "long_term",
          "example": "https://i.imgur.com/aD4WkXl.png",
          "fonts": [
            { "src": "SF Movie Poster.ttf", "family": "SF Movie Poster" },
            { "src": "BLADRMF.ttf", "family": "Blade Runner Movie Font" }
          ],
          "images": ["background_text.jpg", "background.jpg"]
        }
        `
      );
      const result = await getBannerConfig("");
      expect(result.fileName).toMatch("");
      expect(result.author).toMatch("Iker Jiménez");
    });
  });

  describe("getSandboxedPlayer", () => {
    it("deletes any other field that isn't important", async () => {
      const player = await getSanboxedPlayer({
        id: "1",
        user: "Ernesto",
        superSensibleData: true,
      });
      expect("superSensibleData" in player).toBe(false);
    });
    it("don't modifies the wanted fields", async () => {
      const sandboxed = await getSanboxedPlayer(user);
      expect(sandboxed.name).toBe(user.name);
    });

    it("get image if found", async () => {
      const sandboxed = await getSanboxedPlayer({ ...user, image: "asd" });
      expect(sandboxed.image).toBeDefined();
    });

    it("doesn't get image if not set in user", async () => {
      const sandboxed = await getSanboxedPlayer(user);
      expect(sandboxed.image).toBeUndefined();
    });

    it("doesn't get image if getting it failed", async () => {
      (loadImage as jest.Mock).mockImplementationOnce(async () => {
        throw Error("Not valid");
      });
      const sandboxed = await getSanboxedPlayer(user);
      expect(sandboxed.image).toBeUndefined();
    });
  });

  describe("getSandboxedPlayer", () => {
    it("deletes any other field that isn't important", async () => {
      const player = await getSanboxedPlayer({
        id: "1",
        user: "Ernesto",
        superSensibleData: true,
      });
      expect("superSensibleData" in player).toBe(false);
    });
  });
});
