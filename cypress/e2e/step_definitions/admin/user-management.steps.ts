import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

const mockUsers = [
  { id: 'user1', name: 'Paciente Existente', email: 'paciente@test.com', role: 'PATIENT', isActive: true },
];
const newSecretary = { id: 'user2', name: 'Secretaria Demo', email: 'secre@demo.com', role: 'SECRETARY', isActive: true };

Given('un usuario "Admin" está autenticado', () => {
  cy.login('admin@demo.com', 'AdminPass123');
});

When('navega a la página de {string}', (pageName: string) => {
  cy.intercept({ method: 'GET', url: /\/api\/admin\/users/ }, { body: mockUsers }).as('getUsers');
  cy.visit('/admin/user-management');
  cy.wait('@getUsers');
});

When('hago clic en el botón {string}', (buttonText: string) => {
  cy.get('button').contains(buttonText).click();
});

When('lleno el formulario con nombre {string}, email {string}, RUT {string}', (name: string, email: string, rut: string) => {
  cy.get('#name-input').type(name);
  cy.get('#email-input').type(email);
  cy.get('#rut-input').type(rut);
});

When('selecciono el rol {string}', (role: string) => {
  cy.get('#role-select').select(role);
});

When('hago clic en {string}', (buttonText: string) => {
  cy.intercept({ method: 'POST', url: /\/api\/admin\/users\/create/ }, { statusCode: 201, body: newSecretary }).as('createUser');
  cy.intercept({ method: 'GET', url: /\/api\/admin\/users/ }, { body: [...mockUsers, newSecretary] }).as('getUsersReload');
  
  cy.get('button').contains(buttonText).click();
});

Then('debería ver el mensaje {string}', (message: string) => {
  cy.wait('@createUser');
  cy.contains(message).should('be.visible');
});

Then('el usuario {string} debería aparecer en la tabla de usuarios', (userName: string) => {
  cy.wait('@getUsersReload');
  cy.get('table').contains(userName).should('be.visible');
});

Given('el email {string} ya existe en el sistema', (email: string) => {
});

Then('debería ver un mensaje de error {string}', (errorMessage: string) => {
  cy.intercept({ method: 'POST', url: /\/api\/admin\/users\/create/ }, { 
    statusCode: 400, 
    body: { message: 'El correo electrónico ya está en uso' } 
  }).as('createUserFail');
  
  cy.get('button').contains('Guardar').click();
  cy.wait('@createUserFail');
  cy.get('.form-error').contains(errorMessage).should('be.visible');
});

Then('el modal de creación no debería cerrarse', () => {
  cy.get('[data-testid="create-user-modal"]').should('be.visible');
});

Given('existe un usuario {string} con rol {string}', (userName: string, role: string) => {
  cy.intercept({ method: 'GET', url: /\/api\/admin\/users/ }, { body: [newSecretary] }).as('getUsers');
  cy.visit('/admin/user-management');
  cy.wait('@getUsers');
});

When('hago clic en {string} en la fila de {string}', (buttonText: string, userName: string) => {
  cy.get('tr').contains(userName).find('button').contains(buttonText).click();
});

Then('se abre el modal de edición', () => {
  cy.get('[data-testid="edit-user-modal"]').should('be.visible');
});

When('cambio el rol a {string}', (newRole: string) => {
  cy.get('[data-testid="edit-user-modal"]').find('#role-select').select(newRole);
});

Then('la fila de {string} debería mostrar el rol {string}', (userName: string, newRole: string) => {
  cy.intercept({ method: 'PUT', url: /\/api\/admin\/users\/user2/ }, { statusCode: 200 }).as('updateUser');
  const updatedUser = { ...newSecretary, role: 'ADMIN' };
  cy.intercept({ method: 'GET', url: /\/api\/admin\/users/ }, { body: [updatedUser] }).as('getUsersReload');

  cy.get('[data-testid="edit-user-modal"]').find('button').contains('Guardar Cambios').click();
  
  cy.wait('@updateUser');
  cy.wait('@getUsersReload');
  cy.get('tr').contains(userName).parent().contains(newRole).should('be.visible');
});