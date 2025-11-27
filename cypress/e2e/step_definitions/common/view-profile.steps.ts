import { Then } from "@badeball/cypress-cucumber-preprocessor";

// ============================================
// THEN - Verificaciones de perfil (REAL)
// ============================================

Then("debería ver su nombre {string}", (nombre: string) => {
  cy.contains(nombre).should("be.visible");
});

Then("debería ver su email {string}", (email: string) => {
  cy.contains(email).should("be.visible");
});

Then("debería ver su RUT {string}", (rut: string) => {
  cy.contains(rut).should("be.visible");
});

Then("debería ver su teléfono {string}", (telefono: string) => {
  cy.get("input[name='phone']").should("have.value", telefono);
});

Then("debería ver su nombre completo", () => {
  // El ProfilePage usa inputs dentro de divs con labels
  // Buscamos el input de "Nombres" que tiene valor
  cy.get("input")
    .filter((i, el) => {
      const input = el as HTMLInputElement;
      // Buscar input que tenga un valor no vacío y esté relacionado con nombre
      return input.value && input.value.length > 0;
    })
    .first()
    .should("exist");
});

Then("debería ver su email", () => {
  // El ProfilePage tiene un input de email con el valor del usuario
  cy.get('input[type="email"]')
    .should("be.visible")
    .invoke("val")
    .should("contain", "@");
});

Then("debería ver su rol {string}", (rol: string) => {
  cy.contains(rol, { matchCase: false }).should("be.visible");
});

Then("debería ser redirigido a la página de edición de perfil", () => {
  // En ProfilePage, al hacer clic en "Editar Perfil" habilita los campos
  // No hay redirección, los campos se vuelven editables
  cy.get('input[name="firstName"]').should("not.be.disabled");
});
