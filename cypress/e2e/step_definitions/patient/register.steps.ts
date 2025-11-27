import {
  Given,
  When,
  Then,
  DataTable,
} from "@badeball/cypress-cucumber-preprocessor";

// Variables para compartir entre steps
let registrationData: Record<string, string> = {};
let uniqueRut: string = "";

// Generar RUT único para evitar conflictos en tests
const generateUniqueRut = (): string => {
  // 1. Generar un número base aleatorio entre 5.000.000 y 29.999.999
  // (Rango realista para personas en Chile)
  const rutNum = Math.floor(Math.random() * 25000000) + 5000000;

  // 2. Calcular el Dígito Verificador usando Módulo 11
  let suma = 0;
  let multiplicador = 2;
  let aux = rutNum;

  while (aux > 0) {
    suma += (aux % 10) * multiplicador;
    aux = Math.floor(aux / 10);
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = suma % 11;
  const dvCalc = 11 - resto;

  let dv: string;
  if (dvCalc === 11) dv = "0";
  else if (dvCalc === 10) dv = "K";
  else dv = dvCalc.toString();

  // 3. Formatear con puntos y guión
  const rutStr = rutNum.toString();
  // Usamos Regex para poner los puntos automáticamente
  const formattedBody = rutStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${formattedBody}-${dv}`;
};

// ============================================
// REGISTRO (REAL - sin mocks)
// ============================================

Given("que accedo a la página de registro", () => {
  cy.visit("/register");
  cy.get('input[name="firstName"]').should("be.visible");
});

When(
  "completo el formulario de registro con datos válidos",
  (dataTable: DataTable) => {
    const data = dataTable.rowsHash();

    // Generar RUT único para este test
    uniqueRut = generateUniqueRut();

    // Guardar datos con RUT único
    registrationData = {
      ...data,
      rut: uniqueRut,
      email: `test.${Date.now()}@horavital.cl`, // Email único también
    };

    // Información Personal
    cy.get('input[name="firstName"]')
      .clear()
      .type(registrationData.firstName || data.firstName);
    cy.get('input[name="lastName"]')
      .clear()
      .type(registrationData.lastName || data.lastName);
    cy.get('input[name="rut"]').clear().type(registrationData.rut);
    cy.get('input[name="birthDate"]').clear().type(data.birthDate);

    // Información de Contacto
    cy.get('input[name="email"]').clear().type(registrationData.email);
    cy.get('input[name="phone"]').clear().type(data.phone);

    // Credenciales
    cy.get('input[name="password"]').clear().type(data.password);
    cy.get('input[name="confirmPassword"]').clear().type(data.confirmPassword);
  }
);

When("envío el formulario de registro", () => {
  cy.get('button[type="submit"]')
    .contains(/Registrarse|Crear cuenta/i)
    .click();
  // Esperar respuesta del backend
  cy.wait(2000);
});

When("envío el formulario de registro sin completar datos", () => {
  cy.get('button[type="submit"]')
    .contains(/Registrarse|Crear cuenta/i)
    .click();
});

Then("debería ser redirigido al home", () => {
  cy.url({ timeout: 10000 }).should("include", "/home");
});

Then("debería estar autenticado correctamente", () => {
  cy.window().then((win) => {
    expect(win.localStorage.getItem("token")).to.exist;
    expect(win.localStorage.getItem("user")).to.exist;
  });
});

// ============================================
// VALIDACIONES DE REGISTRO
// ============================================

Then("no debería ser redirigido al home", () => {
  cy.url().should("include", "/register");
});

When("ingreso un RUT con formato inválido {string}", (rut: string) => {
  cy.get('input[name="rut"]').clear().type(rut);
});

When("completo los demás campos correctamente", () => {
  const uniqueEmail = `test.${Date.now()}@horavital.cl`;

  cy.get('input[name="firstName"]').clear().type("Juan");
  cy.get('input[name="lastName"]').clear().type("Pérez");
  cy.get('input[name="birthDate"]').clear().type("1990-05-15");
  cy.get('input[name="email"]').clear().type(uniqueEmail);
  cy.get('input[name="phone"]').clear().type("+56912345678");
  cy.get('input[name="password"]').clear().type("Test123456!");
  cy.get('input[name="confirmPassword"]').clear().type("Test123456!");
});

Then("debería ver un error de formato de RUT", () => {
  cy.contains(/no es válido|formato.*inválido|rut.*incorrecto/i).should(
    "be.visible"
  );
});

When(
  "completo el formulario con contraseñas diferentes",
  (dataTable: DataTable) => {
    const data = dataTable.rowsHash();
    const uniqueEmail = `test.${Date.now()}@horavital.cl`;
    const uniqueRut = generateUniqueRut();

    cy.get('input[name="firstName"]').clear().type("Juan");
    cy.get('input[name="lastName"]').clear().type("Pérez");
    cy.get('input[name="rut"]').clear().type(uniqueRut);
    cy.get('input[name="birthDate"]').clear().type("1990-05-15");
    cy.get('input[name="email"]').clear().type(uniqueEmail);
    cy.get('input[name="phone"]').clear().type("+56912345678");
    cy.get('input[name="password"]').clear().type(data.password);
    cy.get('input[name="confirmPassword"]').clear().type(data.confirmPassword);

    cy.get('button[type="submit"]').click();
  }
);

Then("debería ver un error indicando que las contraseñas no coinciden", () => {
  cy.contains(/contraseñas no coinciden|passwords.*match/i).should(
    "be.visible"
  );
});
