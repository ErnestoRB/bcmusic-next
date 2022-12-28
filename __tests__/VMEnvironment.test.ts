import { join } from "path";
import executeBanner from "../utils/banners/index";

const basePath = join(process.cwd(), "utils", "banners");

describe("VM environment for banner creation", () => {
  it("Should return buffer instance on successful banner name", async () => {
    const result = await executeBanner(
      "synthwave",
      [{ name: "hola" }],
      basePath
    );
    expect(result).toBeInstanceOf(Buffer);
  });

  it("Should fail on unknown banner", async () => {
    expect.assertions(1);
    try {
      await executeBanner("Hola", [{ name: "hola" }], basePath);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
