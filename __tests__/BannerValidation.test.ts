import { BannerValidation } from "../utils/authorization/validation/joi/bannerRecords";

describe("BannerRecordValidation", () => {
  it("Fails when nothing is sent", async () => {
    try {
      await BannerValidation.validateAsync(undefined);
    } catch (error: any) {
      expect(error).toBeDefined();
    }
    expect.assertions(1);
  });
});
