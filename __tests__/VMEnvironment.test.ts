/*
 * @jest-environment node
 */
import { executeBanner } from "../utils/banners/vm";
import { ScriptReturn } from "../utils/validation/vm";

describe("VM environment", () => {
  it("Should not let return anything but Promise|Function|Buffer", () => {
    let { value, error } = ScriptReturn.validate("123", { convert: false });
    expect(value).toBeUndefined();
    expect(error).toBeDefined();

    let { value: v1, error: e1 } = ScriptReturn.validate(Buffer.from("Hola"), {
      convert: false,
    });
    expect(v1).toBeDefined();
    expect(e1).toBeUndefined();

    let { value: v2, error: e2 } = ScriptReturn.validate(() => {}, {
      convert: false,
    });
    expect(v2).toBeDefined();
    expect(e2).toBeUndefined();
  });

  it("Should not let a script run more than 5s", async () => {
    try {
      await executeBanner("while(1){}", { width: 200, height: 200 }, [], []);
    } catch (error: any) {
      expect(error.message).toMatch(/timed out/);
    }
  });

  it("Should not let finish the process", async () => {
    try {
      await executeBanner(
        'this.constructor.constructor("return process")().exit()',
        { width: 200, height: 200 },
        [],
        []
      );
    } catch (error: any) {
      expect(error.message).toMatch(/is not a function/);
    }
  });
});
