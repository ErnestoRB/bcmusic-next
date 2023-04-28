describe("/api/fonts", () => {
  describe("/", () => {
    it("Returns 401 response when requested without been logged", () => {
      cy.request({ failOnStatusCode: false, url: "/api/fonts" }).then(
        (response) => {
          expect(response.status).to.equal(401);
        }
      );
    });

    it("Returns 403 if user is logged but isn't admin", () => {
      const user = Cypress.env("APP_USER");
      const pass = Cypress.env("APP_PASS");
      cy.loginViaPassword(user, pass);
      cy.request({ failOnStatusCode: false, url: "/api/fonts" }).then(
        (response) => {
          expect(response.status).to.equal(403);
        }
      );
    });

    it("Returns 200 if user is admin", () => {
      const user = Cypress.env("ADMIN_APP_USER");
      const pass = Cypress.env("ADMIN_APP_PASS");
      cy.loginViaPassword(user, pass);
      cy.request({ failOnStatusCode: false, url: "/api/fonts" }).then(
        (response) => {
          expect(response.status).to.equal(200);
        }
      );
    });
  });
});
