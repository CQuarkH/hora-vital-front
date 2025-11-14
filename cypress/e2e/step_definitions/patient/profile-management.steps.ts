import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given(
  "que estoy autenticado con RUT {string} y contraseña {string}",
  (rut: string, password: string) => {
    cy.login(rut, password);
    cy.url().should("not.include", "/login");
  }
);

Given("que estoy en la página de perfil", () => {
  cy.visit("/profile");
  cy.url().should("include", "/profile");

  // Esperar a que la página cargue
  cy.contains("Mi Perfil", { timeout: 10000 }).should("be.visible");
});

When("hago clic en el botón {string}", (buttonText: string) => {
  cy.contains("button", buttonText).click();
});

When("actualizo mi nombre a {string}", (newName: string) => {
  // Buscar el input de "Nombres"
  cy.contains("label", /Nombres/i)
    .parent()
    .find("input")
    .clear()
    .type(newName);
});

When("actualizo mi apellido a {string}", (newLastName: string) => {
  // Buscar el input de "Apellidos"
  cy.contains("label", /Apellidos/i)
    .parent()
    .find("input")
    .clear()
    .type(newLastName);
});

When("actualizo mi dirección a {string}", (newAddress: string) => {
  // Buscar el input de "Dirección"
  cy.contains("label", /Dirección/i)
    .parent()
    .find("input")
    .clear()
    .type(newAddress);
});

When("actualizo mi teléfono a {string}", (newPhone: string) => {
  // Buscar el input de "Teléfono"
  cy.contains("label", /Teléfono/i)
    .parent()
    .find("input")
    .clear()
    .type(newPhone);
});

When("modifico mi nombre a {string}", (tempName: string) => {
  cy.contains("label", /Nombres/i)
    .parent()
    .find("input")
    .clear()
    .type(tempName);
});

When("intento cambiar mi correo a {string}", (invalidEmail: string) => {
  cy.contains("label", /Correo/i)
    .parent()
    .find("input")
    .clear()
    .type(invalidEmail);
});

Then("debería ver los campos deshabilitados nuevamente", () => {
  // Verificar que los campos editables estén deshabilitados
  cy.contains("label", /Nombres/i)
    .parent()
    .find("input")
    .should("be.disabled");

  cy.contains("label", /Apellidos/i)
    .parent()
    .find("input")
    .should("be.disabled");
});

Then("debería ver mis datos actualizados en el perfil", () => {
  // El toast ya aparece automáticamente
  cy.contains(/Perfil actualizado|éxito/i, { timeout: 5000 }).should(
    "be.visible"
  );
});

Then("debería ver el nombre original sin cambios", () => {
  // Verificar que el nombre volvió al valor original (Elías)
  cy.contains("label", /Nombres/i)
    .parent()
    .find("input")
    .should("have.value", "Elías");
});

Then("el campo {string} debería estar deshabilitado", (fieldName: string) => {
  const fieldMap: { [key: string]: RegExp } = {
    RUT: /RUT/i,
    "Fecha de Nacimiento": /Fecha de Nacimiento/i,
    Género: /Género/i,
  };

  const pattern = fieldMap[fieldName];

  cy.contains("label", pattern).parent().find("input").should("be.disabled");
});

Then("debería ver un mensaje de error {string}", (message: string) => {
  // Buscar el mensaje de error (puede ser en toast o en el formulario)
  cy.contains(message, { timeout: 5000 }).should("be.visible");
});

Then("los cambios no deberían guardarse", () => {
  // El formulario debería seguir en modo edición o mostrar error
  cy.contains("button", "Guardar Cambios").should("be.visible");
});
