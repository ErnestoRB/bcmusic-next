describe("/api/banner", () => {
  describe("/", () => {
    it("Returns 401 response when requested without been logged", async () => {
      cy.request("/api/banner").then((response) => {
        expect(response.status).to.equal(401);
      });
    });
  });
  describe("/execute", () => {
    it("Returns 401 response when requested without been logged", async () => {
      cy.request("/api/banner/execute").then((response) => {
        expect(response.status).to.equal(401);
      });
    });
  });

  describe("/:id", () => {
    it("Returns 401 response when requested without been logged", async () => {
      cy.request("/api/banner/1").then((response) => {
        expect(response.status).to.equal(401);
      });
    });
  });
});
