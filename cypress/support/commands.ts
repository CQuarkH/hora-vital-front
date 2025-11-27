/// <reference types="cypress" />

declare global {
    namespace Cypress {
        interface Chainable {
            login(rut: string, password: string): Chainable<void>;
            loginAsPatient(): Chainable<void>;
            loginAsSecretary(): Chainable<void>;
            loginAsAdmin(): Chainable<void>;
            logout(): Chainable<void>;
            apiLogin(rut: string, password: string): Chainable<{ token: string; user: any }>;
        }
    }
}

const API_URL = Cypress.env('API_URL') || 'http://localhost:4000';

// Credenciales del seed del backend
export const TEST_CREDENTIALS = {
    patient: {
        rut: '33.333.333-3',
        password: 'Password123!',
        email: 'paciente@horavital.cl',
        firstName: 'Juan',
        lastName: 'Paciente'
    },
    secretary: {
        rut: '22.222.222-2',
        password: 'Password123!',
        email: 'secretaria@horavital.cl',
        firstName: 'Maria',
        lastName: 'Secretaria'
    },
    admin: {
        rut: '11.111.111-1',
        password: 'Password123!',
        email: 'admin@horavital.cl',
        firstName: 'Admin',
        lastName: 'Principal'
    }
};

/**
 * Login via API y almacenar token en localStorage
 */
Cypress.Commands.add('apiLogin', (rut: string, password: string) => {
    return cy.request({
        method: 'POST',
        url: `${API_URL}/api/auth/login`,
        body: { rut, password },
        failOnStatusCode: false
    }).then((response) => {
        if (response.status === 200 && response.body.data) {
            const { token, user } = response.body.data;
            return { token, user };
        } else {
            throw new Error(`Login failed: ${response.body?.message || response.body?.error || 'Unknown error'}`);
        }
    });
});

/**
 * Login real usando sesión de Cypress para mejor performance
 */
Cypress.Commands.add('login', (rut: string, password: string) => {
    cy.session([rut, password], () => {
        cy.apiLogin(rut, password).then(({ token, user }) => {
            window.localStorage.setItem('token', token);
            window.localStorage.setItem('user', JSON.stringify(user));
        });
    }, {
        validate() {
            cy.window().then((win) => {
                const token = win.localStorage.getItem('token');
                expect(token).to.exist;
            });
        },
        cacheAcrossSpecs: true
    });
});

/**
 * Login rápido como paciente de prueba
 */
Cypress.Commands.add('loginAsPatient', () => {
    cy.login(TEST_CREDENTIALS.patient.rut, TEST_CREDENTIALS.patient.password);
});

/**
 * Login rápido como secretaria de prueba
 */
Cypress.Commands.add('loginAsSecretary', () => {
    cy.login(TEST_CREDENTIALS.secretary.rut, TEST_CREDENTIALS.secretary.password);
});

/**
 * Login rápido como admin de prueba
 */
Cypress.Commands.add('loginAsAdmin', () => {
    cy.login(TEST_CREDENTIALS.admin.rut, TEST_CREDENTIALS.admin.password);
});

/**
 * Logout limpiando localStorage
 */
Cypress.Commands.add('logout', () => {
    cy.clearLocalStorage();
    cy.clearCookies();
    Cypress.session.clearAllSavedSessions();
});

export { };