describe("Login", () => {
  it.skip("To Spotify", () => {
    const user = Cypress.env("SPOTIFY_USER");
    const pass = Cypress.env("SPOTIFY_PASS");

    cy.loginToSpotify(user, pass);
  });

  it("Via email & pass", () => {
    const user = Cypress.env("APP_USER");
    const pass = Cypress.env("APP_PASS");

    cy.loginViaPassword(user, pass);
  });
});
