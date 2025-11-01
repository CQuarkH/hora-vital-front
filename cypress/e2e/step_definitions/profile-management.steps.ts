import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// ============================================
// SETUP Y NAVEGACIÓN
// ============================================

Given('que estoy autenticado con RUT {string} y contraseña {string}', (rut: string, password: string) => {
    cy.login(rut, password);
    cy.url().should('not.include', '/login');
});

Given('que estoy en la página de perfil', () => {
    cy.visit('/profile');
    cy.contains('Mi Perfil').should('be.visible');
});

// ============================================
// ACCIONES DE EDICIÓN
// ============================================

When('hago clic en el botón {string}', (buttonText: string) => {
    cy.contains('button', buttonText).click();
});

When('actualizo mi nombre a {string}', (nombre: string) => {
    cy.get('input[name="firstName"]').clear().type(nombre);
});

When('actualizo mi apellido a {string}', (apellido: string) => {
    cy.get('input[name="lastName"]').clear().type(apellido);
});

When('actualizo mi dirección a {string}', (direccion: string) => {
    cy.get('input[name="address"]').clear().type(direccion);
});

When('actualizo mi teléfono a {string}', (telefono: string) => {
    cy.get('input[name="phone"]').clear().type(telefono);
});

When('modifico mi nombre a {string}', (nombre: string) => {
    cy.get('input[name="firstName"]').clear().type(nombre);
});

When('intento cambiar mi correo a {string}', (email: string) => {
    cy.get('input[name="email"]').clear().type(email);
});

When('borro el contenido del campo de nombres', () => {
    cy.get('input[name="firstName"]').clear();
});

When('borro el contenido del campo de apellidos', () => {
    cy.get('input[name="lastName"]').clear();
});

// ============================================
// VERIFICACIONES
// ============================================

Then('debería ver los campos deshabilitados nuevamente', () => {
    cy.get('input[name="firstName"]').should('be.disabled');
    cy.get('input[name="lastName"]').should('be.disabled');
    cy.get('input[name="address"]').should('be.disabled');
    cy.get('input[name="phone"]').should('be.disabled');
    cy.get('input[name="email"]').should('be.disabled');
});

Then('debería ver mis datos actualizados en el perfil', () => {
    cy.get('input[name="firstName"]').should('have.value', 'Juan Carlos');
    cy.get('input[name="lastName"]').should('have.value', 'Pérez González');
    cy.get('input[name="address"]').should('have.value', 'Av. Principal 123, Santiago');
    cy.get('input[name="phone"]').should('have.value', '+56 9 8765 4321');
});

Then('debería ver el nombre original sin cambios', () => {
    cy.get('input[name="firstName"]').should('not.have.value', 'Nombre Temporal');
});

Then('debería ver un mensaje de error {string}', (errorMessage: string) => {
    cy.contains(errorMessage).should('be.visible');
});

Then('los cambios no deberían guardarse', () => {
    cy.get('input[name="email"]').should('not.be.disabled');
});

// ============================================
// VERIFICACIÓN DE CAMPOS NO EDITABLES
// ============================================

Then('el campo {string} debería estar deshabilitado', (fieldLabel: string) => {
    cy.contains('label', fieldLabel)
        .parent()
        .find('input')
        .should('be.disabled');
});