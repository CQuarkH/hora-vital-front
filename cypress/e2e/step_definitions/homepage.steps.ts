import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('que abro la aplicación', () => {
    cy.visit('/');
});

Then('debería ver el contenido principal', () => {
    cy.get('body').should('be.visible');
});