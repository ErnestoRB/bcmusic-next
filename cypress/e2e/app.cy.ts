describe("Navigation", () => {
  it("should show the root", () => {
    // Start from the index page
    cy.visit("http://localhost:3000/");

    cy.contains(/Ernesto Ram[ií]rez/);
  });

  it("should navigate to the login page", () => {
    // Start from the index page
    cy.visit("http://localhost:3000/");

    // Find a link with an href attribute containing "about" and click it
    cy.get('a[href*="login"]').click();

    // The new url should include "/about"
    cy.url().should("include", "/login");

    // The new page should contain an h1 with "About page"
    cy.contains("Spotify");
  });

  it("should navigate to the privacy policy", () => {
    // Start from the index page
    cy.visit("http://localhost:3000/");

    // Find a link with an href attribute containing "about" and click it
    cy.get('[nav-options] > a[href*="politica"]').click();

    // The new url should include "/about"
    cy.url().should("include", "/politica");

    // The new page should contain an h1 with "About page"
    cy.contains(/[pP]rivacidad/);
  });

  it("/banner should be accessible even if not logged", () => {
    // Start from the index page
    cy.visit("http://localhost:3000/");

    // Find a link with an href attribute containing "about" and click it
    cy.get('[nav-options] > a[href*="banner"]').click();

    // The new url should include "/about"
    cy.url().should("include", "/banner");

    // The new page should contain an h1 with "About page"
    cy.contains(/[pP]rivacidad/);
  });

  it("/about is rendered", () => {
    // Start from the index page
    cy.visit("http://localhost:3000/about");

    // The new page should contain an h1 with "About page"
    cy.contains(/BashCrashers MusicApp/);
  });
});
