import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

const mockAppointments = [
  { id: 'cardio123', patientName: 'Benjamin San Martin', doctorName: 'Dr. Akel', status: 'CONFIRMED' },
  { id: 'derma456', patientName: 'Elias Currihuil', doctorName: 'Dra. Ana', status: 'CONFIRMED' },
];
const mockFilteredAppointments = [
  { id: 'cardio123', patientName: 'Benjamin San Martin', doctorName: 'Dr. Akel', status: 'CONFIRMED' },
];

When('navega a la página de {string}', (pageName: string) => {
  cy.intercept({ method: 'GET', url: /\/api\/appointments\/all/ }, { body: mockAppointments }).as('getAllAppointments');
  cy.visit('/secretary/appointments');
  cy.wait('@getAllAppointments');
});

Given('la tabla muestra citas de {string} y {string}', (doc1: string, doc2: string) => {
  cy.get('table').contains(doc1).should('be.visible');
  cy.get('table').contains(doc2).should('be.visible');
});

When('selecciono al profesional {string} en el filtro', (doctorName: string) => {
  cy.intercept({ method: 'GET', url: /\/api\/appointments\/all\?doctor=.*/ }, { body: mockFilteredAppointments }).as('filterAppointments');
  cy.get('#doctor-filter-select').select(doctorName);
});

When('hago clic en {string}', (buttonText: string) => {
  cy.get('button').contains(buttonText).click();
});

Then('la tabla solo debería mostrar citas del {string}', (doctorName: string) => {
  cy.wait('@filterAppointments');
  cy.get('[data-testid="appointment-row-cardio123"]').should('be.visible');
});

Then('la tabla ya no debería mostrar citas de {string}', (doctorName: string) => {
  cy.get('[data-testid="appointment-row-derma456"]').should('not.exist');
});

Given('la tabla muestra citas de {string} y {string}', (paciente1: string, paciente2: string) => {
});

When('escribo {string} en el buscador', (patientName: string) => {
  cy.intercept({ method: 'GET', url: /\/api\/appointments\/all\?search=.*/ }, { body: mockFilteredAppointments }).as('searchAppointments');
  cy.get('#patient-search-input').type(patientName);
});

Then('la tabla solo debería mostrar citas de {string}', (patientName: string) => {
  cy.wait('@searchAppointments');
  cy.get('[data-testid="appointment-row-cardio123"]').should('be.visible');
  cy.get('[data-testid="appointment-row-derma456"]').should('not.exist');
});

Given('la tabla muestra la cita {string} de {string}', (appId: string, patientName: string) => {
});

When('hago clic en {string} en la fila de la cita {string}', (buttonText: string, appId: string) => {
  cy.get(`[data-testid="appointment-row-${appId}"]`).find('button').contains(buttonText).click();
});

When('confirmo la cancelación en el modal', () => {
  cy.intercept({ method: 'POST', url: /\/api\/appointments\/cancel\/cardio123/ }, { statusCode: 200 }).as('cancelApi');
  const cancelledAppointments = [
    { ...mockFilteredAppointments[0], status: 'CANCELLED' },
    mockAppointments[1],
  ];
  cy.intercept({ method: 'GET', url: /\/api\/appointments\/all/ }, { body: cancelledAppointments }).as('getAllAppointments');

  cy.get('[data-testid="confirm-cancel-button"]').click();
});

Then('la fila de la cita {string} debería mostrar el estado {string}', (appId: string, status: string) => {
  cy.wait('@cancelApi');
  cy.get(`[data-testid="appointment-row-${appId}"]`).contains(status).should('be.visible');
});