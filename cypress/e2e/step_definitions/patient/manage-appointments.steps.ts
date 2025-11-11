import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

const mockUpcomingAppointment = {
  id: 'cardio123',
  specialty: 'Cardiología',
  doctorName: 'Dr. Akel',
  date: '2025-11-20T10:00:00',
  status: 'CONFIRMED',
};
const mockPastAppointment = {
  id: 'derma456',
  specialty: 'Dermatología',
  doctorName: 'Dra. Ana',
  date: '2025-10-10T11:00:00',
  status: 'COMPLETED',
};

Given('el paciente tiene una {string} próxima', (appointmentName: string) => {
  cy.intercept({ method: 'GET', url: /\/api\/appointments\?status=upcoming/ }, {
    body: [mockUpcomingAppointment],
  }).as('getUpcoming');
});

Given('el paciente tiene una {string} pasada', (appointmentName: string) => {
  cy.intercept({ method: 'GET', url: /\/api\/appointments\?status=past/ }, {
    body: [mockPastAppointment],
  }).as('getPast');
});

When('navega a la página {string}', (pageName: string) => {
  cy.visit('/patient/my-appointments');
});

Then('debería ver la {string} en la pestaña {string}', (appointmentName: string, tab: string) => {
  cy.wait('@getUpcoming');
  cy.get('[data-testid="appointment-card-cardio123"]').should('be.visible');
});

When('hace clic en la pestaña {string}', (tabName: string) => {
  cy.get('button').contains(tabName).click();
});

Then('debería ver la {string} en la lista de pasadas', (appointmentName: string) => {
  cy.wait('@getPast');
  cy.get('[data-testid="appointment-card-derma456"]').should('be.visible');
});

Given('el paciente está en la pestaña {string}', (tabName: string) => {
  cy.wait('@getUpcoming');
});

When('hace clic en el botón {string} de la {string}', (buttonText: string, appointmentName: string) => {
  cy.get('[data-testid="appointment-card-cardio123"]')
    .find('button')
    .contains(buttonText)
    .click();
});

Then('se abre un modal de confirmación', () => {
  cy.get('[data-testid="cancel-modal"]').should('be.visible');
});

When('hace clic en el botón {string} en el modal', (buttonText: string) => {
  cy.intercept({ method: 'POST', url: /\/api\/appointments\/cancel\/cardio123/ }, {
    statusCode: 200,
    body: { message: 'Cita cancelada' },
  }).as('cancelApi');
  
  cy.intercept({ method: 'GET', url: /\/api\/appointments\?status=upcoming/ }, {
    body: [],
  }).as('getUpcomingEmpty');

  cy.get('[data-testid="cancel-modal"]')
    .find('button')
    .contains(buttonText)
    .click();
});

Then('debería ver el mensaje {string}', (message: string) => {
  cy.wait('@cancelApi');
  cy.contains(message).should('be.visible');
});

Then('la {string} ya no debería aparecer en la lista {string}', (appointmentName: string, tab: string) => {
  cy.wait('@getUpcomingEmpty');
  cy.get('[data-testid="appointment-card-cardio123"]').should('not.exist');
});

When('hace clic en el botón {string} (o {string}) en el modal', (btn1: string, btn2: string) => {
  cy.get('[data-testid="cancel-modal"]')
    .find('button')
    .contains(btn1) 
    .click();
});

Then('el modal se cierra', () => {
  cy.get('[data-testid="cancel-modal"]').should('not.be.visible');
});
Then('la {string} aún debe estar en la lista {string}', (appointmentName: string, tab: string) => {
  cy.get('[data-testid="appointment-card-cardio123"]').should('be.visible');
});