import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

When('navega a la página {string}', (pageName: string) => {
  cy.intercept({ method: 'GET', url: /\/api\/doctors/ }, { body: [{ id: 'akel1', name: 'Dr. Akel' }] }).as('getDoctors');
  cy.visit('/secretary/schedule-management');
  cy.wait('@getDoctors');
});

When('selecciono al profesional {string}', (doctorName: string) => {
  cy.get('#doctor-select').select(doctorName);
});

When('marco el día {string}', (dayName: string) => {
  cy.get(`[data-testid="day-checkbox-${dayName.toLowerCase()}"]`).check();
});

When('defino la hora de inicio {string} y hora de fin {string}', (startTime: string, endTime: string) => {
  cy.get('#start-time-input').type(startTime);
  cy.get('#end-time-input').type(endTime);
});

When('defino la duración de consulta como {string} minutos', (duration: string) => {
  cy.get('#duration-select').select(duration);
});

When('hago clic en {string}', (buttonText: string) => {
  if (buttonText === 'Guardar Horario') {
    cy.intercept({ method: 'POST', url: /\/api\/schedules/ }, { statusCode: 201 }).as('saveSchedule');
  }
  cy.get('button').contains(buttonText).click();
});

Then('debería ver los bloques {string}, {string}, {string}, {string}, {string}, {string}', (s1: string, s2: string, s3: string, s4: string, s5: string, s6: string) => {
  cy.get('[data-testid="preview-slots-list"]').contains(s1).should('be.visible');
  cy.get('[data-testid="preview-slots-list"]').contains(s6).should('be.visible');
});

Then('debería ver un mensaje de {string}', (message: string) => {
  cy.wait('@saveSchedule');
  cy.contains(message).should('be.visible');
});

Then('debería ver un mensaje de error {string}', (errorMessage: string) => {
  cy.get('.form-error').contains(errorMessage).should('be.visible');
});