import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('un usuario {string} está autenticado', (role: string) => {
  if ((role || '').toLowerCase() === 'paciente') {
    cy.login('12.345.678-9', 'Test123456');
  } else {
    cy.login(role, 'Test123456');
  }
  cy.url().should('not.include', '/login');
});

Given('navega a la página de {string}', (page: string) => {
  if ((page || '').toLowerCase() === 'agendar cita') {
    cy.visit('/patient/book');
    return;
  }

  cy.visit(page);
});

When('el paciente selecciona la especialidad {string}', (especialidad: string) => {
  cy.intercept({ method: 'GET', url: /\/api\/availability\?specialty=.*/ }, {
    body: {
      "20-11-2025": [{ time: '10:00', isBooked: false }, { time: '10:30', isBooked: true }],
      "22-11-2025": [{ time: '09:00', isBooked: true }, { time: '09:30', isBooked: false }],
    }
  }).as('getAvailability');
  
  cy.get('#specialty-select').select(especialidad);
});

When('selecciona el día {string} del próximo mes en el calendario', (day: string) => {
  cy.get('button.calendar-day').contains(day).click();
});

Then('el sistema muestra los horarios disponibles para ese día', () => {
  cy.wait('@getAvailability');
  cy.get('[data-testid="time-slot-10:00"]').should('be.visible').and('not.be.disabled');
});

When('el paciente selecciona el horario {string}', (time: string) => {
  cy.get(`[data-testid="time-slot-${time}"]`).click();
});

When('hace clic en el botón "Confirmar Agendamiento"', () => {
  cy.intercept('POST', '/api/appointments/book', {
    statusCode: 201,
    body: { id: 123, date: '2025-11-20T10:00:00', status: 'CONFIRMED' }
  }).as('bookAppointment');
  
  cy.get('button').contains('Confirmar Agendamiento').click();
});

Then('debería ser redirigido a la página de confirmación', () => {
  cy.wait('@bookAppointment');
  cy.url().should('include', '/patient/appointment/confirmation');
});

Then('debería ver el mensaje {string}', (message: string) => {
  cy.contains(message).should('be.visible');
});

Given('el sistema tiene horarios reservados para {string} el día {string}', (specialty: string, day: string) => {
});

Then('el horario {string} debería estar visible pero deshabilitado', (time: string) => {
  cy.wait('@getAvailability');
  cy.get(`[data-testid="time-slot-${time}"]`).should('be.visible').and('be.disabled');
});

Then('el horario {string} debería estar habilitado', (time: string) => {
  cy.get(`[data-testid="time-slot-${time}"]`).should('be.visible').and('not.be.disabled');
});

Then('debería ver un mensaje de error {string}', (message: string) => {
  cy.intercept('POST', '/api/appointments/book', { 
    statusCode: 400, 
    body: { message: "Debes seleccionar un horario disponible" }
  }).as('bookFail');

  cy.get('button').contains('Confirmar Agendamiento').click();
  
  cy.wait('@bookFail');
  cy.get('.form-error').contains(message).should('be.visible');
});

Then('el paciente permanece en la página de agendamiento', () => {
  cy.url().should('include', '/patient/book');
});