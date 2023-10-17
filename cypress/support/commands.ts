/// <reference types="cypress" />
import { v4 as uuidv4 } from "uuid";

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare global {
  namespace Cypress {
    interface Chainable {
      loginToSpotify(email: string, password: string): Chainable<void>;
      loginViaPassword(email: string, password: string): Chainable<void>;
    }
  }
}
function loginViaSpotify(username: string, password: string) {
  // Página de inicio de sesión
  cy.visit("/auth/login");
  cy.get("button#spotify-login").click();

  // Login on Auth0.
  cy.origin(
    "https://accounts.spotify.com/",
    { args: { username, password } },
    ({ username, password }) => {
      cy.get("input#login-username").type(username);
      cy.get("input#login-password").type(password, { log: false });
      cy.get("button#login-button").click();
      cy.getCookies()
        .should("have.length.at.least", 1)
        .then((cookies) => {
          console.log(cookies);
        });
    }
  );

  cy.getCookies()
    .should("have.length.at.least", 1)
    .then((cookies) => {
      console.log(cookies);
    });

  /*   cy.getCookie("nextauth.session")
    .should("exist")
    .then((cookie) => {
      cy.clearAllCookies();
      cy.setCookie("nextauth.session", cookie!.value!, { ...cookie });
    }); */

  // Ensure Auth0 has redirected us back to the RWA.
  cy.url().should("equal", "http://localhost:3000/");
}

function loginViaPassword(username: string, password: string) {
  cy.session(
    uuidv4(),
    () => {
      // Página de inicio de sesión
      cy.visit("/auth/login");
      cy.get("button#password-login").click();

      cy.get("input#input-email").type(username);
      cy.get("input#input-password").type(password, { log: false });
      cy.get("button#login-button").click();

      // Redirección a pagina principal
      cy.url().should("equal", "http://localhost:3000/");
    },
    {
      validate: () => {
        cy.getCookie("next-auth.session-token").should("exist");
      },
    }
  );
}

Cypress.Commands.add("loginToSpotify", (username: string, password: string) => {
  const log = Cypress.log({
    displayName: "Spotify",
    message: [`🔐 Authenticating | ${username}`],
    // @ts-ignore
    autoEnd: false,
  });
  log.snapshot("before");

  loginViaSpotify(username, password);

  log.snapshot("after");
  log.end();
});

Cypress.Commands.add(
  "loginViaPassword",
  (username: string, password: string) => {
    const log = Cypress.log({
      displayName: "Email & Pass",
      message: [`🔐 Authenticating | ${username}`],
      // @ts-ignore
      autoEnd: false,
    });
    log.snapshot("before");

    loginViaPassword(username, password);

    log.snapshot("after");
    log.end();
  }
);
