import executeBanner from "../utils/banners";

const user = { name: "Ernesto", id: "123" };

describe("VM environment", () => {
  it("Should return buffer instance on successful banner name", async () => {
    const result = await executeBanner("synthwave", [{ name: "hola" }], user);
    expect(result).toBeInstanceOf(Buffer);
  });
});
