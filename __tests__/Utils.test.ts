import { BannerHistoryDate } from "../utils/validation/bannerRecords";
import { PaginationValidation } from "../utils/validation/pagination";
import {
  isAdmin,
  onlyAllowAdmins,
  sessionRequired,
} from "../utils/validation/user";

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
    describe("sessionRequired()", () => {
      it("return true when session is null", () => {
        const jsonSpy = jest.fn();
        const reqSpy = {
          status: jest.fn((status: number) => ({
            json: jsonSpy,
          })),
        };
        /// @ts-ignore
        expect(sessionRequired(null, reqSpy)).toBe(true);
        expect(reqSpy.status).toBeCalledTimes(1);
        expect(jsonSpy).toBeCalledTimes(1);
      });
    });

    describe("onlyAllowAdmins()", () => {
      it("return true when session is null", () => {
        const jsonSpy = jest.fn();
        const reqSpy = {
          status: jest.fn((status: number) => ({
            json: jsonSpy,
          })),
        };
        /// @ts-ignore
        expect(onlyAllowAdmins(null, reqSpy)).toBe(true);
        expect(jsonSpy).toBeCalledTimes(1);
        expect(reqSpy.status).toBeCalledTimes(1);
      });
      it("return true when user is undefined", () => {
        const jsonSpy = jest.fn();
        const reqSpy = {
          status: jest.fn((status: number) => ({
            json: jsonSpy,
          })),
        };
        expect(
          onlyAllowAdmins(
            /// @ts-ignore
            {},
            reqSpy
          )
        ).toBe(true);
        expect(jsonSpy).toBeCalledTimes(1);
        expect(reqSpy.status).toBeCalledTimes(1);
      });
      it("return true when tipo_usuario is undefined", () => {
        const jsonSpy = jest.fn();
        const reqSpy = {
          status: jest.fn((status: number) => ({
            json: jsonSpy,
          })),
        };
        expect(
          onlyAllowAdmins(
            /// @ts-ignore
            { user: {} },
            reqSpy
          )
        ).toBe(true);
        expect(jsonSpy).toBeCalledTimes(1);
        expect(reqSpy.status).toBeCalledTimes(1);
      });
      it("return true when tipo_usuario isn't 'admin'", () => {
        const jsonSpy = jest.fn();
        const reqSpy = {
          status: jest.fn((status: number) => ({
            json: jsonSpy,
          })),
        };
        expect(
          onlyAllowAdmins(
            /// @ts-ignore
            { user: { tipo_usuario: { id: 1, nombre: "lo que sea" } } },
            reqSpy
          )
        ).toBe(true);
        expect(jsonSpy).toBeCalledTimes(1);
        expect(reqSpy.status).toBeCalledTimes(1);
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

  describe("BannerHistory", () => {
    it("Should return the actual year & month if not supplied", () => {
      const { error, value } = BannerHistoryDate.validate({});
      expect(error).toBeUndefined();
      const date = new Date();
      expect(value).toEqual({
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      });
    });

    it("Should return the  supplied month & year", () => {
      const { error, value } = BannerHistoryDate.validate({
        year: 2002,
        month: 5,
      });
      expect(error).toBeUndefined();
      expect(value).toEqual({
        month: 5,
        year: 2002,
      });
    });

    it("Should transform string to number", () => {
      const { error, value } = BannerHistoryDate.validate({
        year: "2002",
        month: "5",
      });
      expect(error).toBeUndefined();
      expect(value).toEqual({
        month: 5,
        year: 2002,
      });
    });
  });
});
