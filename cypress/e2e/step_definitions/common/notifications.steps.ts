import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

const mockNotifications = [
  { id: 'n1', read: false, message: 'Tu cita ha sido confirmada' },
  { id: 'n2', read: false, message: 'Recordatorio: Tu cita es mañana' },
];

const mockNotificationsAfterRead = [
  { id: 'n1', read: true, message: 'Tu cita ha sido confirmada' },
  { id: 'n2', read: false, message: 'Recordatorio: Tu cita es mañana' },
];

Given('tiene {string} notificaciones no leídas', (count: string) => {
  cy.intercept({ method: 'GET', url: /\/api\/notifications/ }, { body: mockNotifications }).as('getNotifications');
  cy.visit('/patient/home');
  cy.wait('@getNotifications');
});

Then('el ícono de la campana en el encabezado debería mostrar un badge con el número {string}', (count: string) => {
  cy.get('[data-testid="notification-badge"]').contains(count).should('be.visible');
});

When('hago clic en el ícono de la campana', () => {
  cy.get('[data-testid="notification-bell"]').click();
});

Then('se abre un panel desplegable', () => {
  cy.get('[data-testid="notification-dropdown"]').should('be.visible');
});

Then('debería ver la notificación {string}', (message: string) => {
  cy.get('[data-testid="notification-dropdown"]').contains(message).should('be.visible');
});

Given('el panel de notificaciones está abierto', () => {
  cy.intercept({ method: 'GET', url: /\/api\/notifications/ }, { body: mockNotifications }).as('getNotifications');
  cy.visit('/patient/home');
  cy.wait('@getNotifications');
  cy.get('[data-testid="notification-bell"]').click();
  cy.get('[data-testid="notification-dropdown"]').should('be.visible');
});

When('hago clic en la notificación {string}', (message: string) => {
  cy.intercept({ method: 'POST', url: /\/api\/notifications\/read\/n1/ }, { statusCode: 200 }).as('markAsRead');
  cy.intercept({ method: 'GET', url: /\/api\/notifications/ }, { body: mockNotificationsAfterRead }).as('getNotificationsReload');

  cy.get('[data-testid="notification-card-n1"]').click();
});

Then('la notificación se marca como leída', () => {
  cy.wait('@markAsRead');
  cy.wait('@getNotificationsReload');
  cy.get('[data-testid="notification-card-n1"]').should('have.class', 'opacity-50');
});

Then('el badge de la campana se actualiza a {string}', (count: string) => {
  cy.get('[data-testid="notification-badge"]').contains(count).should('be.visible');
});