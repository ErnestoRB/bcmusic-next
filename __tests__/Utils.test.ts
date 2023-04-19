import { PaginationValidation } from "../utils/validation/pagination";
import { isAdmin } from "../utils/validation/user";

describe("Utility functions", () => {
  describe("utils/validation/user.ts", () => {
    describe("isAdmin()", () => {
      it("return false when nullish is given", () => {
        expect(isAdmin()).toBe(false);
      });

      it("return true only when admin is given", () => {
        expect(isAdmin("Admin")).toBe(true);
        expect(isAdmin("ADMIN")).toBe(true);
        expect(isAdmin("admin")).toBe(true);
      });
    });
  });

  describe("PaginationValidation", () => {
    it("Returns 1 as default page when page attribute isn't present", () => {
      const { error, value } = PaginationValidation.validate({
        page: undefined,
      });
      expect(error).toBeUndefined();
      expect(value.page).toBe(1);
    });

    it("Returns 1 as default page when object is undefined", () => {
      const { error, value } = PaginationValidation.validate(undefined);
      expect(error).toBeUndefined();
      expect(value.page).toBe(1);
    });

    it("Returns error when page overflows (>1000)", () => {
      const { error, value } = PaginationValidation.validate({
        page: 1001,
      });
      expect(error).toBeDefined();
      expect(error!.message).toMatch(/must be less/);
    });

    it("Returns error when page is negative or zero (<1)", () => {
      const { error, value } = PaginationValidation.validate({
        page: 0,
      });
      expect(error).toBeDefined();
      expect(error!.message).toMatch(/must be greater/);
    });
  });
});
