describe("/panel", () => {
  describe("User isn't logged", () => {
    describe("/", () => {
      it("Is redirected to the index", () => {
        cy.visit("/panel");
        cy.location("pathname").should("equal", "/");
      });
    });
  });

  describe("User is logged", () => {
    before(() => {
      const user = Cypress.env("APP_USER");
      const pass = Cypress.env("APP_PASS");
      cy.loginViaPassword(user, pass);
    });
    it("User panel is shown", () => {
      cy.visit("/panel");
      cy.location("pathname").should("equal", "/panel");
      cy.contains("Panel de usuario");
    });
  });
});
