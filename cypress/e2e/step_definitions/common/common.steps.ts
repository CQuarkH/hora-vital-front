import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// Credenciales reales del seed del backend
const CREDENTIALS: { [key: string]: { rut: string; password: string } } = {
  paciente: { rut: "33.333.333-3", password: "Password123!" },
  secretario: { rut: "22.222.222-2", password: "Password123!" },
  secretaria: { rut: "22.222.222-2", password: "Password123!" },
  administrador: { rut: "11.111.111-1", password: "Password123!" },
  admin: { rut: "11.111.111-1", password: "Password123!" },
};

// ============================================
// GIVEN - Steps comunes de autenticación (REAL)
// ============================================

Given("un usuario {string} está autenticado", (role: string) => {
  const roleKey = role.toLowerCase();
  const cred = CREDENTIALS[roleKey] || CREDENTIALS.paciente;

  // Login real usando session de Cypress
  cy.login(cred.rut, cred.password);
  
  // Visitar la página principal después del login
  cy.visit("/");
  
  // Verificar que estamos autenticados
  cy.window().then((win) => {
    expect(win.localStorage.getItem("token")).to.exist;
  });
});

Given(
  "que estoy autenticado con RUT {string} y contraseña {string}",
  (rut: string, password: string) => {
    cy.login(rut, password);
    cy.visit("/");
    cy.window().then((win) => {
      expect(win.localStorage.getItem("token")).to.exist;
    });
  }
);

// ============================================
// WHEN - Steps comunes de navegación
// ============================================

When("navega a la sección {string}", (section: string) => {
  const sectionMap: { [key: string]: string } = {
    "mi perfil": "/profile",
    "mis citas": "/patient/appointments",
    "agendar cita": "/book-appointment",
    pacientes: "/admin/patients",
    "gestión de horarios": "/secretary/schedules",
    "administración de citas": "/secretary/appointments",
    "gestión de usuarios": "/admin/users",
    home: "/home",
    inicio: "/home",
  };

  const url = sectionMap[section.toLowerCase()] || `/${section.toLowerCase().replace(/ /g, "-")}`;
  cy.visit(url);
  
  // Esperar a que la página cargue
  cy.url().should("include", url.split("/").pop());
});

When("hace clic en el botón {string}", (buttonText: string) => {
  cy.contains("button", buttonText, { matchCase: false })
    .should("be.visible")
    .click();
});

When("hace clic en {string}", (text: string) => {
  cy.contains(text, { matchCase: false })
    .should("be.visible")
    .click();
});

When("escribe {string} en el campo de búsqueda", (text: string) => {
  cy.get('input[type="search"], input[placeholder*="Buscar"], input[name="search"]')
    .first()
    .should("be.visible")
    .clear()
    .type(text);
});

When("escribe {string} en el campo {string}", (value: string, fieldName: string) => {
  cy.get(`input[name="${fieldName}"], input[placeholder*="${fieldName}"]`)
    .should("be.visible")
    .clear()
    .type(value);
});

When("selecciona el filtro {string} con valor {string}", (filterName: string, value: string) => {
  cy.get(`select[name="${filterName}"], select`)
    .filter(`:contains("${filterName}")`)
    .first()
    .select(value);
});

When("hace clic fuera del panel", () => {
  cy.get("body").click(0, 0);
});

When("espera {int} segundos", (seconds: number) => {
  cy.wait(seconds * 1000);
});

// ============================================
// THEN - Steps comunes de verificación
// ============================================

Then("debería ver el mensaje {string}", (message: string) => {
  cy.contains(message, { timeout: 10000 }).should("be.visible");
});

Then("debería ver el mensaje de error {string}", (errorMessage: string) => {
  cy.contains(errorMessage, { timeout: 5000 }).should("be.visible");
});

Then("debería ser redirigido a la página de {string}", (pageName: string) => {
  const pageUrl = pageName.toLowerCase().replace(/ /g, "-");
  cy.url({ timeout: 10000 }).should("include", pageUrl);
});

Then("el campo {string} debería estar deshabilitado", (fieldName: string) => {
  cy.get(`input[name="${fieldName}"], input[placeholder*="${fieldName}"]`)
    .should("be.disabled");
});

Then("debería ver una tabla con {string}", (tableName: string) => {
  cy.get("table").should("be.visible");
});

Then(
  "la tabla debería tener columnas {string}, {string}, {string}, {string}, {string}",
  (col1: string, col2: string, col3: string, col4: string, col5: string) => {
    [col1, col2, col3, col4, col5].forEach((col) => {
      cy.get("thead, th").should("contain.text", col);
    });
  }
);

Then("no debería ser redirigido", () => {
  // Verificar que permanecemos en la misma URL
  cy.url().then((currentUrl) => {
    cy.wait(500);
    cy.url().should("eq", currentUrl);
  });
});

Then("debería estar en la página {string}", (pagePath: string) => {
  cy.url().should("include", pagePath);
});
