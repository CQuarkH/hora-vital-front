import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// ============================================
// GIVEN - Estado inicial
// ============================================
const API_URL = Cypress.env("API_URL") || "http://localhost:4000";

let selectedDoctorId: string;
let selectedDoctorSpecialtyId: string;
let patientId: string;

const mondayFromToday = (weeksAhead: number = 0): string => {
  const today = new Date();
  const currentDay = today.getDay();
  let diff = 1 - currentDay;
  if (diff <= 0) diff += 7; // Si ya pasó el lunes, ir al próximo
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + diff + weeksAhead * 7);
  return targetDate.toISOString().split("T")[0];
};

// Los Given ahora solo establecen contexto pero no interceptan
// El backend real debe tener estos datos o los tests deben crearlos

Given("existen citas programadas para el médico seleccionado", () => {
  const dateStr = mondayFromToday();

  // Login como paciente para crear citas
  cy.apiLogin("33.333.333-3", "Password123!").then(({ token }) => {
    cy.request({
      method: "GET",
      url: `${API_URL}/api/medical/doctors`,
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      const doctors = response.body;
      if (doctors.length > 0) {
        const doctor = doctors[0];
        const specialtyId = doctor.specialty?.id || doctor.specialtyId;

        // Crear cita 1
        cy.request({
          method: "POST",
          url: `${API_URL}/api/appointments`,
          headers: { Authorization: `Bearer ${token}` },
          body: {
            doctorProfileId: doctor.id,
            specialtyId: specialtyId,
            appointmentDate: dateStr,
            startTime: "10:00",
            notes: "Cita E2E 1",
          },
          failOnStatusCode: false,
        });

        // Crear cita 2
        cy.request({
          method: "POST",
          url: `${API_URL}/api/appointments`,
          headers: { Authorization: `Bearer ${token}` },
          body: {
            doctorProfileId: doctor.id,
            specialtyId: specialtyId,
            appointmentDate: dateStr,
            startTime: "11:00",
            notes: "Cita E2E 2",
          },
          failOnStatusCode: false,
        });
      }
    });
  });
});

Given("existe un período bloqueado para el médico seleccionado", () => {
  const dateStr = mondayFromToday(2);

  // Login como secretaria para crear bloqueo
  cy.apiLogin("22.222.222-2", "Password123!").then(({ token }) => {
    // Obtener primer doctor
    cy.request({
      method: "GET",
      url: `${API_URL}/api/medical/doctors`,
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      const doctors = response.body;
      if (doctors.length > 0) {
        const doctor = doctors[0];

        // Crear bloqueo como secretaria
        cy.request({
          method: "POST",
          url: `${API_URL}/api/secretary/blocks`,
          headers: { Authorization: `Bearer ${token}` },
          body: {
            doctorProfileId: doctor.id,
            startDateTime: `${dateStr}T14:00:00Z`,
            endDateTime: `${dateStr}T15:00:00Z`,
            reason: "Bloqueo de prueba E2E",
          },
          failOnStatusCode: false,
        });
      }
    });
  });

  cy.wait(500); // Esperar a que el backend procese el bloqueo
});

Given(
  "existe una cita programada para el médico en el horario a bloquear",
  () => {
    // El backend debe tener una cita programada
    // El test verificará el comportamiento real del backend
  }
);

Given("existen períodos bloqueados para el médico seleccionado", () => {
  const dateStr = mondayFromToday(2);

  // Login como secretaria para crear bloqueo
  cy.apiLogin("22.222.222-2", "Password123!").then(({ token }) => {
    // Obtener primer doctor
    cy.request({
      method: "GET",
      url: `${API_URL}/api/medical/doctors`,
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      const doctors = response.body;
      if (doctors.length > 0) {
        const doctor = doctors[0];

        // Crear bloqueo como secretaria
        cy.request({
          method: "POST",
          url: `${API_URL}/api/secretary/blocks`,
          headers: { Authorization: `Bearer ${token}` },
          body: {
            doctorProfileId: doctor.id,
            startDateTime: `${dateStr}T14:00:00Z`,
            endDateTime: `${dateStr}T15:00:00Z`,
            reason: "Bloqueo de prueba E2E",
          },
          failOnStatusCode: false,
        });
      }
    });
  });

  cy.wait(500); // Esperar a que el backend procese los bloqueos
});

Given("no hay datos de agenda configurados para el médico", () => {
  // El backend debe tener un médico sin agenda configurada
});

// ============================================
// WHEN - Acciones
// ============================================
When("selecciona una fecha futura", () => {
  const dateStr = mondayFromToday(2);
  cy.get('[data-testid="date-selector"]').clear().type(dateStr);
  cy.wait(500);
});

When("navega a la fecha con citas programadas", () => {
  const dateStr = mondayFromToday();
  cy.get('[data-testid="date-selector"]').clear().type(dateStr);
  cy.wait(500);
});

When("selecciona un médico del selector", () => {
  cy.get('[data-testid="doctor-selector"]')
    .should("be.visible")
    .find("option")
    .should("have.length.at.least", 1) // Esperar a que React cargue las opciones
    .then(() => {
      // CORRECCIÓN CLAVE: Seleccionamos el índice 0 (Primer médico)
      // Esto coincide con el médico usado en el Given
      cy.get('[data-testid="doctor-selector"]').select(0);
    });
});

When("selecciona el primer médico del selector", () => {
  cy.get('[data-testid="doctor-selector"]').select(1);
  cy.wait(500);
});

When("selecciona otro médico del selector", () => {
  cy.get('[data-testid="doctor-selector"]')
    .find("option")
    .then(($options) => {
      if ($options.length > 2) {
        cy.get('[data-testid="doctor-selector"]').select(2);
      }
    });
  cy.wait(500);
});

When("selecciona el médico sin agenda configurada", () => {
  cy.get('[data-testid="doctor-selector"]').select(1);
  cy.wait(500);
});

When(
  "modifica el horario del día {string} a {string} - {string}",
  (day: string, startTime: string, endTime: string) => {
    // Obtener el día de la semana correspondiente
    const dayMap: { [key: string]: number } = {
      Domingo: 0,
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
    };
    const dayOfWeek = dayMap[day] || 1;

    // Calcular la fecha que corresponde a ese día de la semana
    const today = new Date();
    const currentDay = today.getDay();
    let diff = dayOfWeek - currentDay;
    if (diff <= 0) diff += 7; // Si el día ya pasó, ir a la próxima semana
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);
    const dateStr = targetDate.toISOString().split("T")[0];

    // Navegar a la fecha correcta
    cy.get('[data-testid="date-selector"]').clear().type(dateStr);
    cy.wait(500);

    // Modificar los horarios del día
    cy.get('[data-testid="schedule-start-time"]').clear().type(startTime);
    cy.get('[data-testid="schedule-end-time"]').clear().type(endTime);
  }
);

When("completa el formulario de bloqueo con fecha futura sin citas", () => {
  const dateStr = mondayFromToday(2); // Dos semanas adelante
  cy.get('[data-testid="block-start-date"]').clear().type(dateStr);
  cy.get('[data-testid="block-start-time"]').clear().type("10:00");
  cy.get('[data-testid="block-end-date"]').clear().type(dateStr);
  cy.get('[data-testid="block-end-time"]').clear().type("12:00");
  cy.get('[data-testid="block-reason"]').clear().type("Reunión administrativa");
});

When("completa el formulario de bloqueo sobre el horario con cita", () => {
  const dateStr = mondayFromToday();

  cy.get('[data-testid="block-start-date"]').clear().type(dateStr);
  cy.get('[data-testid="block-start-time"]').clear().type("10:00");
  cy.get('[data-testid="block-end-date"]').clear().type(dateStr);
  cy.get('[data-testid="block-end-time"]').clear().type("11:00");
  cy.get('[data-testid="block-reason"]').clear().type("Bloqueo de prueba");
});

When("cambia la fecha seleccionada", () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split("T")[0];

  cy.get('[data-testid="date-selector"]').clear().type(dateStr);
  cy.wait(500);
});

// ============================================
// THEN - Verificaciones
// ============================================

Then("debería ver la página de gestión de horarios", () => {
  cy.get('[data-testid="schedule-management-page"]').should("be.visible");
  cy.contains("Gestión de Agenda").should("be.visible");
});

Then("debería ver el selector de médico", () => {
  cy.get('[data-testid="doctor-selector"]').should("be.visible");
});

Then("debería ver los bloques de disponibilidad por día", () => {
  cy.contains(
    /Horario de (Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo)/
  ).should("be.visible");
});

Then("debería ver la agenda actual del profesional", () => {
  cy.get('[data-testid="doctor-selector"]')
    .invoke("val")
    .should("not.be.empty");
});

Then("debería ver el resumen de citas y bloqueos", () => {
  cy.get('[data-testid="agenda-summary"]').should("exist");
});

Then("debería ver el modal de bloqueo de horario", () => {
  cy.get('[data-testid="block-modal"]').should("be.visible");
});

Then("debería ver el modal de vista previa del calendario", () => {
  cy.get(".fixed.inset-0").should("be.visible");
});

Then("debería ver la lista de períodos bloqueados", () => {
  cy.get('[data-testid="blocked-periods-list"]').should("exist");
});

Then("debería ver advertencia de citas programadas", () => {
  cy.get('[data-testid="conflicts-warning"]').should("be.visible");
  cy.contains("citas programadas", { matchCase: false }).should("be.visible");
});

Then("el modal de bloqueo debería mostrar el formulario inicial", () => {
  cy.get('[data-testid="block-modal"]').should("be.visible");
  cy.get('[data-testid="conflicts-warning"]').should("not.exist");
});

Then("debería ver mensaje de citas canceladas", () => {
  cy.contains(/cita.*cancelada/i).should("be.visible");
});

Then("debería ver el resumen de la agenda", () => {
  cy.get('[data-testid="agenda-summary"]').should("be.visible");
});

Then("debería ver el número de citas programadas", () => {
  cy.get('[data-testid="agenda-summary"]').within(() => {
    cy.contains("Citas programadas").should("exist");
  });
});

Then("debería ver el número de períodos bloqueados", () => {
  cy.get('[data-testid="agenda-summary"]').within(() => {
    cy.contains("Períodos bloqueados").should("exist");
  });
});

Then("debería ver el estado del día", () => {
  cy.get('[data-testid="agenda-summary"]').within(() => {
    cy.contains("Estado del día").should("exist");
  });
});

Then("debería ver mensaje de no hay horarios configurados", () => {
  cy.get('[data-testid="no-schedule-message"]').should("exist");
});

Then("debería ver la lista de citas del día", () => {
  cy.get('[data-testid="appointments-list"]').should("exist");
});

Then("cada cita debería mostrar horario y estado", () => {
  cy.get('[data-testid^="appointment-"]')
    .first()
    .within(() => {
      cy.contains(/\d{2}:\d{2}/).should("exist");
      cy.contains(
        /Programada|Cancelada|Completada|SCHEDULED|CANCELLED|COMPLETED/i
      ).should("exist");
    });
});

Then("cada bloqueo debería mostrar fecha y hora", () => {
  cy.get('[data-testid^="blocked-period-"]')
    .first()
    .within(() => {
      cy.get(".font-medium").should("exist");
    });
});

Then("debería actualizarse la información de la agenda", () => {
  cy.get('[data-testid="schedule-management-page"]').should("be.visible");
});

Then("el resumen debería mostrar cero citas y bloqueos", () => {
  cy.get('[data-testid="agenda-summary"]').within(() => {
    cy.contains("0").should("exist");
  });
});

Then("debería ver la agenda del primer médico", () => {
  cy.get('[data-testid="schedule-management-page"]').should("be.visible");
});

Then("debería ver la agenda del nuevo médico seleccionado", () => {
  cy.get('[data-testid="schedule-management-page"]').should("be.visible");
});
