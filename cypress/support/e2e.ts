// Importar comandos personalizados
import './commands.ts';

// Configuración global
Cypress.on('uncaught:exception', (err: Error, runnable: Mocha.Runnable) => {
    // Prevenir que errores no controlados fallen los tests
    return false;
});