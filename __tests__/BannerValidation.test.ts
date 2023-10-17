import { BannerRecordValidation } from "../utils/authorization/validation/bannerRecords";

describe("BannerRecordValidation", () => {
  it("Fails when nothing is sent", async () => {
    try {
      await BannerRecordValidation.validateAsync(undefined);
    } catch (error: any) {
      expect(error).toBeDefined();
    }
    expect.assertions(1);
  });
});
