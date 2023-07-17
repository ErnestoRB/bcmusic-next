/*
 * @jest-environment node
 */
import { getBufferFromExecution, runInBannerContext } from "../../vm";
import { ScriptReturn } from "../../utils/validation/vm";
import { isPromise } from "util/types";

describe("VM environment", () => {
  it("ScriptReturn.validate should not let return anything but Promise|Function|Buffer", () => {
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

  describe("runInBannerContext()", () => {
    it("Should not let a script run more than 5s", async () => {
      try {
        // @ts-ignore
        await runInBannerContext({}, "while(1){}");
      } catch (error: any) {
        expect(error.message).toMatch(/timed out/);
      }
    });

    it("Should return error from the script", async () => {
      try {
        // @ts-ignore
        await runInBannerContext({}, "function a() {} await a()");
      } catch (error: any) {
        expect(error.message).toBe(
          "await is only valid in async functions and the top level bodies of modules"
        );
      }
    });

    it("Should not let finish the process", async () => {
      try {
        await runInBannerContext(
          // @ts-ignore
          {},
          'this.constructor.constructor("return process")().exit()'
        );
      } catch (error: any) {
        expect(error.message).toMatch(/is not a function/);
      }
    });

    describe("getBufferFromExecution()", () => {
      it("isPromise is working properly", () => {
        expect(isPromise(Promise.resolve(1)));
        expect(isPromise(async function () {}));
      });
      it("Should return buffer untouched", async () => {
        expect(await getBufferFromExecution(Buffer.from([0x00]))).toEqual(
          Buffer.from([0x00])
        );
      });
      it("Should unwrap buffer from function", async () => {
        expect(
          await getBufferFromExecution(function () {
            return Buffer.from([0x00]);
          })
        ).toEqual(Buffer.from([0x00]));
      });

      it("Should unwrap buffer from promise", async () => {
        expect(
          await getBufferFromExecution(Promise.resolve(Buffer.from([0x00])))
        ).toEqual(Buffer.from([0x00]));
      });

      it("Should unwrap buffer from async function", async () => {
        expect(
          await getBufferFromExecution(async function () {
            return Buffer.from([0x00]);
          })
        ).toEqual(Buffer.from([0x00]));
      });
    });
  });
});
