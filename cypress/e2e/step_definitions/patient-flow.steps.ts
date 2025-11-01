import { Given, When, Then, DataTable } from '@badeball/cypress-cucumber-preprocessor';

// Variables para compartir entre steps
let registrationData: Record<string, string> = {};

// ============================================
// REGISTRO
// ============================================

Given('que accedo a la página de registro', () => {
    cy.visit('/register');
});

When('completo el formulario de registro con datos válidos', (dataTable: DataTable) => {
    const data = dataTable.rowsHash();
    registrationData = data;

    // Información Personal
    cy.get('input[name="firstName"]').type(data.firstName);
    cy.get('input[name="lastName"]').type(data.lastName);
    cy.get('input[name="rut"]').type(data.rut);
    cy.get('input[name="birthDate"]').type(data.birthDate);

    // Información de Contacto
    cy.get('input[name="email"]').type(data.email);
    cy.get('input[name="phone"]').type(data.phone);

    // Credenciales
    cy.get('input[name="password"]').type(data.password);
    cy.get('input[name="confirmPassword"]').type(data.confirmPassword);
});

When('envío el formulario de registro', () => {
    cy.get('button[type="submit"]').contains('Registrarse').click();
});

When('envío el formulario de registro sin completar datos', () => {
    cy.get('button[type="submit"]').contains('Registrarse').click();
});

Then('debería ser redirigido al home', () => {
    cy.url().should('include', '/home');
});

Then('debería estar autenticado correctamente', () => {
    cy.window().its('localStorage.token').should('exist');
});

// ============================================
// VALIDACIONES DE REGISTRO
// ============================================

Then('debería ver mensajes de error en campos obligatorios', () => {
    cy.contains(/nombre es obligatorio/i).should('be.visible');
    cy.contains(/apellido es obligatorio/i).should('be.visible');
    cy.contains(/rut es obligatorio/i).should('be.visible');
    cy.contains(/correo es obligatorio/i).should('be.visible');
});

Then('no debería ser redirigido', () => {
    cy.url().should('include', '/register');
});

When('ingreso un RUT con formato inválido {string}', (rut: string) => {
    cy.get('input[name="rut"]').type(rut);
});

When('completo los demás campos correctamente', () => {
    cy.get('input[name="firstName"]').type('Juan');
    cy.get('input[name="lastName"]').type('Pérez');
    cy.get('input[name="birthDate"]').type('1990-05-15');
    cy.get('input[name="email"]').type('juan@test.com');
    cy.get('input[name="phone"]').type('+56912345678');
    cy.get('input[name="password"]').type('Test123456');
    cy.get('input[name="confirmPassword"]').type('Test123456');
});

Then('debería ver un error de formato de RUT', () => {
    cy.contains(/formato de rut inválido/i).should('be.visible');
});

When('completo el formulario con contraseñas diferentes', (dataTable: DataTable) => {
    const data = dataTable.rowsHash();

    cy.get('input[name="firstName"]').type('Juan');
    cy.get('input[name="lastName"]').type('Pérez');
    cy.get('input[name="rut"]').type('12.345.678-9');
    cy.get('input[name="birthDate"]').type('1990-05-15');
    cy.get('input[name="email"]').type('juan@test.com');
    cy.get('input[name="phone"]').type('+56912345678');
    cy.get('input[name="password"]').type(data.password);
    cy.get('input[name="confirmPassword"]').type(data.confirmPassword);

    cy.get('button[type="submit"]').click();
});

Then('debería ver un error indicando que las contraseñas no coinciden', () => {
    cy.contains(/contraseñas no coinciden/i).should('be.visible');
});

// ============================================
// AGENDAMIENTO DE CITA
// ============================================

When('navego a la sección de agendar cita', () => {
    cy.contains('Agendar').click();
});

When('selecciono una especialidad {string}', (especialidad: string) => {
    cy.get('select[name="especialidad"]').select(especialidad);
});

When('selecciono una fecha disponible', () => {
    cy.wait(1000);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateString = futureDate.toISOString().split('T')[0];

    cy.get('input[type="date"]').clear().type(dateString);
});

When('selecciono un horario disponible', () => {
    cy.wait(1000);
    cy.get('.horario-disponible').first().click();
});

When('confirmo el agendamiento', () => {
    cy.get('button').contains(/confirmar|agendar/i).click();
});

Then('debería ver un mensaje de confirmación de cita', () => {
    cy.contains(/cita agendada|confirmación|éxito/i, { timeout: 10000 }).should('be.visible');
});

Then('debería ver mi cita en la lista de próximas citas', () => {
    cy.contains(/mis citas|citas/i).click();
    cy.get('[data-testid="appointment-item"]').should('have.length.greaterThan', 0);
});