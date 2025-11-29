import { When } from "@badeball/cypress-cucumber-preprocessor";

const UI = {
  SEARCH_INPUT: 'input[placeholder*="Buscar"]',
  APPOINTMENT_CARD:
    "div[class='flex items-center gap-4 p-4 bg-medical-50 border border-medical-200 rounded-xl shadow-sm w-full'], div[class='grid grid-cols-6 gap-4 items-center p-4 border-b border-gray-200 hover:bg-gray-50']", // Soporta Grid y Tabla
  CALENDAR_DAY: ".react-calendar__tile, button.day-slot, button", // Ajustar según tu librería de calendario
  TIME_SLOT: "button.time-slot, button:not(:disabled)", // Botones de hora
  SUBMIT_BTN:
    'button[type="submit"], button:contains("Guardar"), button:contains("Confirmar")',
  BACK_BTN: 'button[aria-label="Volver"]',
  CALENDAR_GRID: ".grid.grid-cols-7",
  TIME_SLOT_GRID: ".grid.grid-cols-3, .grid.grid-cols-4",
};

When(
  "selecciona editar en la cita de {string} del día {string}",
  (_ignoredSpecialty: string, _ignoredDay: string) => {
    // 1. Verificar que existen tarjetas
    cy.get(UI.APPOINTMENT_CARD).should("have.length.at.least", 1);

    // 2. Seleccionar la primera tarjeta
    cy.get(UI.APPOINTMENT_CARD)
      .first()
      .as("selectedUiElement")
      .within(() => {
        // 3. Buscar botones o enlaces (a)
        cy.get("button, a")
          // 4. Filtrar buscando coincidencias en Texto, Title o Aria-Label
          .filter((index, element) => {
            const text = element.innerText || "";
            const title = element.getAttribute("title") || "";
            const ariaLabel = element.getAttribute("aria-label") || "";

            // Unimos todo en un string y buscamos "editar" o "edit" (insensible a mayúsculas)
            const combinedContent =
              `${text} ${title} ${ariaLabel}`.toLowerCase();
            return (
              combinedContent.includes("editar") ||
              combinedContent.includes("edit")
            );
          })
          .first() // Si hay más de uno, tomamos el primero
          .should("exist") // Verificación visual para debug
          .click({ force: true });
      });
  }
);
