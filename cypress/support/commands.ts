/// <reference types="cypress" />

declare global {
    namespace Cypress {
        interface Chainable {
            login(email: string, password: string): Chainable<void>;
            logout(): Chainable<void>;
        }
    }
}

Cypress.Commands.add('login', (rut: string, password: string) => {
    cy.visit('/login');
    cy.get('input[name="rut"]').type(rut);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('logout', () => {
    cy.clearLocalStorage();
    cy.clearCookies();
});

export { };