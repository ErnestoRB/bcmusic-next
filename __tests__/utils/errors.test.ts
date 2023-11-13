import { censureString, censureError } from "../../vm/errors";

describe("Error utils", () => {
  const cwd = process.cwd();

  describe("censure(string)", () => {
    it("should censure cwd on a string", () => {
      const error = new Error();
      const originalStack = error.stack!;
      const censuredStack = censureString(error.stack!);
      expect(originalStack).not.toBe(censuredStack);
      expect(censuredStack).not.toContain(cwd);
    });
  });

  describe("censure(error)", () => {
    let error: Error;
    let cwdSpy = jest.spyOn(process, "cwd");

    beforeEach(() => {
      error = new Error(`We're on ${cwd}`);
      cwdSpy.mockClear();
    });

    it("should censure both message & stack", () => {
      const { stack, message } = error;
      expect(stack).toContain(cwd);
      expect(message).toContain(cwd);
      censureError(error);
      const { stack: censuredStack, message: censuredMessage } = error;
      expect(censuredStack).not.toContain(cwd);
      expect(censuredMessage).not.toContain(cwd);
      expect(stack).not.toBe(censuredStack);
      expect(message).not.toBe(censuredMessage);
    });
  });
});
