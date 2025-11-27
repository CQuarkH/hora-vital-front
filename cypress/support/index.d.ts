/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
        login(rut: string, password: string): Chainable<void>;
        loginAsPatient(): Chainable<void>;
        loginAsSecretary(): Chainable<void>;
        loginAsAdmin(): Chainable<void>;
        logout(): Chainable<void>;
        apiLogin(rut: string, password: string): Chainable<{ token: string; user: any }>;
    }
}

export const TEST_CREDENTIALS: {
    patient: { rut: string; password: string; email: string; firstName: string; lastName: string };
    secretary: { rut: string; password: string; email: string; firstName: string; lastName: string };
    admin: { rut: string; password: string; email: string; firstName: string; lastName: string };
};