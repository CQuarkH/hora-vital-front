// Importar comandos personalizados
import './commands';

// Configuración global para tests E2E reales
Cypress.on('uncaught:exception', (err: Error, runnable: Mocha.Runnable) => {
    // Ignorar errores de hidratación de React y otros errores comunes
    if (err.message.includes('hydrat') || 
        err.message.includes('ResizeObserver') ||
        err.message.includes('Network Error')) {
        return false;
    }
    // Para otros errores, dejar que fallen los tests
    return true;
});

// Antes de cada test, asegurar que localStorage está limpio si no hay sesión
beforeEach(() => {
    // Preservar sesiones entre tests del mismo spec
    cy.session
});

// Log de configuración al iniciar
before(() => {
    cy.log(`🔧 API URL: ${Cypress.env('API_URL')}`);
    cy.log(`🌐 Base URL: ${Cypress.config('baseUrl')}`);
});