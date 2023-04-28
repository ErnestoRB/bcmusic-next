describe("/api/banners", () => {
  it("Returns 200 response when requested", async () => {
    cy.request("/api/banners").then((response) => {
      expect(response.status).to.equal(200);
    });
  });
});
