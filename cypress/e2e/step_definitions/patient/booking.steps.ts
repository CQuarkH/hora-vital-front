import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// Variable global para controlar si ya se configuró el intercept
let availabilityInterceptConfigured = false;

// ============================================
// GIVEN - Configuración inicial
// ============================================

Given("un usuario {string} está autenticado", (role: string) => {
  if ((role || "").toLowerCase() === "paciente") {
    cy.login("21.600.919-3", "HoraVital2024!");
  } else {
    cy.login(role, "Test123456");
  }
  cy.url().should("not.include", "/login");

  // Reset del flag al iniciar nuevo escenario
  availabilityInterceptConfigured = false;
});

Given("navega a la página de {string}", (page: string) => {
  if ((page || "").toLowerCase() === "agendar cita") {
    // Configurar el intercept ANTES de visitar la página
    if (!availabilityInterceptConfigured) {
      cy.intercept(
        { method: "GET", url: /\/api\/availability.*/ },
        {
          statusCode: 200,
          body: {
            "20-11-2025": [
              { time: "10:00 AM", available: true }, // ← Cambiar isBooked a available
              { time: "10:30 AM", available: false },
              { time: "11:00 AM", available: true },
            ],
            "25-11-2025": [
              { time: "10:00 AM", available: true }, // ← Cambiar isBooked a available
              { time: "10:30 AM", available: true },
              { time: "11:00 AM", available: false },
            ],
            "26-11-2025": [
              { time: "09:00 AM", available: false }, // ← Cambiar isBooked a available
              { time: "09:30 AM", available: true },
              { time: "10:00 AM", available: true },
            ],
          },
        }
      ).as("getAvailability");
      availabilityInterceptConfigured = true;
    }

    cy.visit("/book-appointment");
    return;
  }
  cy.visit(page);
});

Given(
  "el sistema tiene horarios reservados para {string} el día {string}",
  (specialty: string, day: string) => {
    cy.log(`Contexto: Horarios reservados para ${specialty} el día ${day}`);
  }
);

// ============================================
// WHEN - Acciones del usuario
// ============================================

When(
  "el paciente selecciona la especialidad {string}",
  (especialidad: string) => {
    // Buscar select de especialidad de forma flexible
    cy.get("body").then(($body) => {
      if ($body.find("#specialty-select").length > 0) {
        cy.get("#specialty-select").select(especialidad);
      } else if ($body.find('select[name="specialty"]').length > 0) {
        cy.get('select[name="specialty"]').select(especialidad);
      } else {
        cy.get("select").first().select(especialidad);
      }
    });

    cy.log(`✓ Especialidad seleccionada: ${especialidad}`);
  }
);

When("el paciente selecciona el médico {string}", (medico: string) => {
  // Esperar a que el select de médico esté habilitado
  cy.get("select").eq(1).should("not.be.disabled");

  // Seleccionar el médico
  cy.get("select").eq(1).select(medico);

  cy.log(`✓ Médico seleccionado: ${medico}`);
});

When(
  "selecciona el día {string} del próximo mes en el calendario",
  (day: string) => {
    // Asegurarnos de que el calendario esté visible
    cy.contains(
      /Enero|Febrero|Marzo|Abril|Mayo|Junio|Julio|Agosto|Septiembre|Octubre|Noviembre|Diciembre/
    ).should("be.visible");

    // Buscar en la grid de 7 columnas (calendario)
    cy.get(".grid.grid-cols-7.gap-1")
      .last()
      .find("button")
      .contains(new RegExp(`^${day}$`))
      .should("not.be.disabled")
      .click({ force: true });

    cy.log(`✓ Día seleccionado: ${day}`);
  }
);

When("el paciente selecciona el horario {string}", (time: string) => {
  // Esperar un poco más para que se rendericen los slots
  cy.wait(1000);

  const normalizedTime = time.trim();

  cy.get(".grid")
    .filter((index, element) => {
      const classes = element.className;
      return classes.includes("grid-cols-3") || classes.includes("grid-cols-4");
    })
    .first()
    .within(() => {
      // Buscar botón que contenga exactamente el tiempo
      // y que NO esté deshabilitado (no tiene line-through)
      cy.get("button")
        .contains(new RegExp(`^${normalizedTime}$`))
        .should("be.visible")
        .and("not.have.class", "line-through")
        .and("not.be.disabled")
        .click();
    });

  cy.log(`✓ Horario seleccionado: ${time}`);

  cy.log(`✓ Horario seleccionado: ${time}`);
});

When('hace clic en el botón "Confirmar Agendamiento"', () => {
  // Interceptar la llamada POST al confirmar
  cy.intercept("POST", "/api/appointments/book", {
    statusCode: 201,
    body: {
      id: 123,
      date: "2025-11-20T10:00:00",
      status: "CONFIRMED",
      message: "Tu cita ha sido agendada con éxito",
    },
  }).as("bookAppointment");

  cy.get("button")
    .contains(/Confirmar Cita|Confirmar Agendamiento/i)
    .should("be.visible")
    .and("not.be.disabled")
    .click();

  cy.log("✓ Botón Confirmar clickeado");
});

// ============================================
// THEN - Verificaciones
// ============================================

Then("el sistema muestra los horarios disponibles para ese día", () => {
  // Esperar a que se rendericen los slots
  cy.wait(1000);

  // Verificar que hay botones de horario visibles en el grid correcto
  cy.get(".grid.grid-cols-3, .grid.grid-cols-4").within(() => {
    cy.get('[data-testid*="time-slot"]')
      .should("have.length.at.least", 1)
      .first()
      .should("be.visible");
  });

  cy.log("✓ Horarios disponibles mostrados");
});

Then("debería ser redirigido a la página de confirmación", () => {
  cy.url({ timeout: 10000 }).should("satisfy", (url: string) => {
    return (
      url.includes("/appointment/confirmation") ||
      url.includes("/appointment-confirmation") ||
      url.includes("/confirmation") ||
      url.includes("/patient/appointment/confirmation")
    );
  });

  cy.log("✓ Redirigido a confirmación");
});

Then("debería ver el mensaje {string}", (message: string) => {
  cy.get("body", { timeout: 10000 }).should("contain.text", message);
  cy.log(`✓ Mensaje verificado: ${message}`);
});

Then(
  "el horario {string} debería estar visible pero deshabilitado",
  (time: string) => {
    cy.wait(1000);

    const normalizedTime = time.trim();

    // Buscar en el grid de time slots
    cy.get(".grid.grid-cols-3, .grid.grid-cols-4").within(() => {
      cy.get(`[data-testid="time-slot-${normalizedTime}"]`)
        .should("be.visible")
        .and("be.disabled");
    });

    cy.log(`✓ Horario ${time} está deshabilitado`);
  }
);

Then("el horario {string} debería estar habilitado", (time: string) => {
  const normalizedTime = time.trim();

  // Buscar en el grid de time slots
  cy.get(".grid.grid-cols-3, .grid.grid-cols-4").within(() => {
    cy.get(`[data-testid="time-slot-${normalizedTime}"]`)
      .should("be.visible")
      .and("not.be.disabled");
  });

  cy.log(`✓ Horario ${time} está habilitado`);
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
  // Buscar el botón de confirmar
  cy.get("button")
    .contains(/Confirmar Cita|Confirmar Agendamiento/i)
    .should("be.visible")
    .and("be.disabled"); // Verificar que esté deshabilitado

  cy.log("✓ Botón Confirmar está deshabilitado correctamente");
});
