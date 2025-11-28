import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const API_URL = Cypress.env("API_URL") || "http://localhost:4000";

// Variables para almacenar estado entre steps
let selectedSpecialtyId: string | null = null;
let selectedDoctorId: string | null = null;

// ============================================
// GIVEN - Configuración inicial (REAL - sin mocks)
// ============================================

Given("navega a la página de {string}", (page: string) => {
  if ((page || "").toLowerCase() === "agendar cita") {
    cy.visit("/book-appointment");
    // Esperar a que carguen las especialidades desde el backend
    cy.get("select").first().should("exist");
    return;
  }
  cy.visit(page);
});

Given(
  "el sistema tiene horarios reservados para {string} el día {string}",
  (specialty: string, day: string) => {
    // Este step ahora es solo informativo - los horarios reales vienen del backend
    cy.log(`Contexto: Verificando horarios para ${specialty} el día ${day}`);
  }
);

// ============================================
// WHEN - Acciones del usuario (REAL)
// ============================================

When(
  "el paciente selecciona la especialidad {string}",
  (especialidad: string) => {
    // Esperar a que el select de especialidades esté disponible y tenga opciones
    cy.get("select").first().should("not.be.disabled");

    // Seleccionar por texto visible
    cy.get("select")
      .first()
      .then(($select) => {
        // Buscar la opción que contiene el texto de la especialidad
        cy.wrap($select).select(especialidad);
      });

    cy.log(`✓ Especialidad seleccionada: ${especialidad}`);

    // Esperar a que se carguen los doctores después de seleccionar especialidad
    cy.wait(500);
  }
);

When("el paciente selecciona el médico {string}", (medico: string) => {
  // Esperar a que el select de médico esté habilitado (se carga después de la especialidad)
  cy.get("select").eq(1).should("not.be.disabled");

  // Seleccionar el médico por nombre
  cy.get("select").eq(1).select(medico);

  cy.log(`✓ Médico seleccionado: ${medico}`);

  // Esperar a que se actualice la disponibilidad
  cy.wait(500);
});

When(
  "selecciona el día {string} del próximo mes en el calendario",
  (day: string) => {
    // Ahora sí podemos usar un selector semántico y robusto
    cy.get('button[aria-label="next month"]').click();

    // Verificación opcional: Asegurar que el texto del mes cambió antes de seguir
    // Esto hace el test mucho más estable que un cy.wait(300)
    // cy.contains(nombreDelMesSiguiente).should('be.visible');

    // Seleccionar el día
    cy.get(".grid.grid-cols-7")
      .last()
      .find("button")
      .contains(new RegExp(`^${day}$`))
      .should("not.be.disabled")
      .click({ force: true });

    cy.wait(1000);
  }
);

When("el paciente selecciona el horario {string}", (time: string) => {
  // Esperar a que se rendericen los slots desde el backend
  cy.wait(500);

  const normalizedTime = time.trim();

  // Buscar el grid de horarios
  cy.get(".grid")
    .filter((index, element) => {
      const classes = element.className;
      return classes.includes("grid-cols-3") || classes.includes("grid-cols-4");
    })
    .first()
    .within(() => {
      // Buscar botón que contenga el tiempo y esté habilitado
      cy.get("button")
        .contains(new RegExp(normalizedTime.replace(":", "\\:")))
        .should("be.visible")
        .and("not.be.disabled")
        .click();
    });

  cy.log(`✓ Horario seleccionado: ${time}`);
});

// ============================================
// THEN - Verificaciones (REAL)
// ============================================

Then("el sistema muestra los horarios disponibles para ese día", () => {
  // Esperar a que los horarios se carguen desde el backend
  cy.wait(1000);

  // Verificar que hay botones de horario visibles
  cy.get(".grid.grid-cols-3, .grid.grid-cols-4").should("exist");

  // Verificar que hay al menos un slot de tiempo
  cy.get("button")
    .filter((i, el) => {
      const text = el.textContent || "";
      return /^\d{1,2}:\d{2}/.test(text);
    })
    .should("have.length.at.least", 1);

  cy.log("✓ Horarios disponibles mostrados desde el backend");
});

Then("debería ser redirigido a la página de confirmación", () => {
  cy.url({ timeout: 15000 }).should("satisfy", (url: string) => {
    return (
      url.includes("/appointment/confirmation") ||
      url.includes("/appointment-confirmation") ||
      url.includes("/confirmation") ||
      url.includes("/patient/appointment/confirmation")
    );
  });

  cy.log("✓ Redirigido a confirmación");
});

Then(
  "el horario {string} debería estar visible pero deshabilitado",
  (time: string) => {
    cy.wait(500);

    const normalizedTime = time.trim();

    // Buscar en el grid de time slots - el horario ocupado debería estar deshabilitado
    cy.get(".grid.grid-cols-3, .grid.grid-cols-4").within(() => {
      cy.get("button")
        .contains(new RegExp(normalizedTime.replace(":", "\\:")))
        .should("be.visible")
        .and("be.disabled");
    });

    cy.log(`✓ Horario ${time} está deshabilitado (ocupado en backend)`);
  }
);

Then("el horario {string} debería estar habilitado", (time: string) => {
  const normalizedTime = time.trim();

  cy.get(".grid.grid-cols-3, .grid.grid-cols-4").within(() => {
    cy.get("button")
      .contains(new RegExp(normalizedTime.replace(":", "\\:")))
      .should("be.visible")
      .and("not.be.disabled");
  });

  cy.log(`✓ Horario ${time} está habilitado (disponible en backend)`);
});

Then("debería ver un mensaje de error {string}", (message: string) => {
  cy.get("body", { timeout: 5000 }).then(($body) => {
    const errorSelectors = [
      ".form-error",
      ".error",
      '[class*="error"]',
      '[role="alert"]',
      ".text-red-600",
      ".text-red-500",
    ];

    let errorFound = false;

    for (const selector of errorSelectors) {
      if ($body.find(selector).length > 0) {
        cy.get(selector).should("be.visible").and("contain.text", message);
        errorFound = true;
        break;
      }
    }

    if (!errorFound) {
      cy.contains(message).should("be.visible");
    }
  });

  cy.log(`✓ Error mostrado: ${message}`);
});

Then("el paciente permanece en la página de agendamiento", () => {
  cy.url().should("satisfy", (url: string) => {
    return (
      url.includes("/book-appointment") ||
      url.includes("/book") ||
      url.includes("/agendar") ||
      (url.includes("/appointment") && !url.includes("/confirmation"))
    );
  });

  cy.log("✓ Usuario permanece en página de agendamiento");
});

Then('el botón "Confirmar Agendamiento" no debería ser clickeable', () => {
  cy.get("button")
    .contains(/Confirmar Cita|Confirmar Agendamiento/i)
    .should("be.visible")
    .and("be.disabled");

  cy.log("✓ Botón Confirmar está deshabilitado correctamente");
});
