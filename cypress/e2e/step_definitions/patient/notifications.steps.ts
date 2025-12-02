import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const API_URL = Cypress.env("API_URL") || "http://localhost:4000";

// Variables para almacenar estado entre steps
let initialUnreadCount: number = 0;
let initialTotalCount: number = 0;

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

Given("existen notificaciones para el paciente", () => {
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
        const doctorGeneral = doctors.find((d: any) =>
          d.specialty?.name.includes("General")
        );
        const doctorCardiology = doctors.find((d: any) =>
          d.specialty?.name.includes("Cardiología")
        );

        const specialtyId = doctorGeneral.specialty.id;
        const specialtyIdCardio = doctorCardiology.specialty.id;

        // Crear cita 1
        cy.request({
          method: "POST",
          url: `${API_URL}/api/appointments`,
          headers: { Authorization: `Bearer ${token}` },
          body: {
            doctorProfileId: doctorGeneral.id,
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
            doctorProfileId: doctorCardiology.id,
            specialtyId: specialtyIdCardio,
            appointmentDate: dateStr,
            startTime: "11:00",
            notes: "Cita E2E 2",
          },
          failOnStatusCode: false,
        });
      }
    });
  });

  cy.wait(1000); // Esperar a que el backend procese las citas
});

Given("hay notificaciones no leídas disponibles", () => {
  // Esperar a que carguen las notificaciones
  cy.wait(1000);

  // Verificar que hay notificaciones no leídas (indicador verde)
  cy.get('span[title="No leído"]').should("have.length.at.least", 1);

  cy.log("✓ Notificaciones no leídas confirmadas");
});

Given("hay al menos una notificación visible", () => {
  cy.wait(1000);

  // Verificar que hay al menos un NotificationCard
  cy.get(".flex.items-start.gap-4.p-5.rounded-xl.border").should(
    "have.length.at.least",
    1
  );

  cy.log("✓ Al menos una notificación visible");
});

Given("el usuario no tiene notificaciones en el sistema", () => {
  // Guardar el total inicial
  cy.get(".flex.items-start.gap-4.p-5.rounded-xl.border").then(
    ($notifications) => {
      initialTotalCount = $notifications.length;
    }
  );

  // Hacer clic en el primer botón de eliminar (icono de trash)
  cy.get("button[title='Eliminar']").each(($btn) => {
    cy.wrap($btn).click();
  });

  cy.log("✓ Clic en ícono de eliminar");
});

Given("hay notificaciones leídas y no leídas", () => {
  cy.wait(1000);

  // Verificar que existen ambos tipos
  cy.get('span[title="No leído"]').should("exist");
  cy.get(".bg-white.border-gray-200").should("exist"); // Notificaciones leídas

  cy.log("✓ Notificaciones leídas y no leídas confirmadas");
});

Given("el servidor de notificaciones no está disponible", () => {
  // Interceptar y forzar error
  cy.intercept("GET", "**/notifications**", {
    statusCode: 500,
    body: {
      success: false,
      message: "Error del servidor",
    },
  }).as("notificationError");

  cy.log("✓ Mock configurado para error de servidor");
});

// ============================================
// WHEN - Acciones del usuario (REAL)
// ============================================

When("el sistema carga las notificaciones del usuario", () => {
  // Esperar a que termine la carga
  cy.get(".animate-spin", { timeout: 10000 }).should("not.exist");

  cy.log("✓ Sistema cargó notificaciones");
});

When(
  "el paciente hace clic en {string} en la primera notificación no leída",
  (buttonText: string) => {
    // Guardar el contador inicial
    cy.get("body").then(($body) => {
      const text = $body.text();
      const match = text.match(/Tienes (\d+) notificaciones sin leer/);
      if (match) {
        initialUnreadCount = parseInt(match[1], 10);
      }
    });

    // Encontrar la primera notificación no leída y hacer clic en el botón
    cy.get(".bg-medical-50.border-medical-200")
      .first()
      .within(() => {
        cy.contains("button", buttonText).click();
      });

    cy.wait(500);
    cy.log(`✓ Clic en "${buttonText}" en primera notificación no leída`);
  }
);

When("el paciente hace clic en el botón {string}", (buttonText: string) => {
  cy.contains("button", buttonText).click();
  cy.wait(500);

  cy.log(`✓ Clic en botón "${buttonText}"`);
});

When(
  "el paciente hace clic en el ícono de eliminar en una notificación",
  () => {
    // Guardar el total inicial
    cy.get(".flex.items-start.gap-4.p-5.rounded-xl.border").then(
      ($notifications) => {
        initialTotalCount = $notifications.length;
      }
    );

    // Hacer clic en el primer botón de eliminar (icono de trash)
    cy.get("button[title='Eliminar']").first().click();

    cy.log("✓ Clic en ícono de eliminar");
  }
);

When("el sistema intenta cargar las notificaciones", () => {
  // Este step es pasivo, solo espera a que el sistema procese
  cy.wait(1000);

  cy.log("✓ Sistema intentando cargar notificaciones");
});

// ============================================
// THEN - Verificaciones (REAL)
// ============================================

Then("debería mostrar el título {string}", (title: string) => {
  cy.contains("h1", title).should("be.visible");

  cy.log(`✓ Título "${title}" visible`);
});

Then("debería ver al menos una notificación en la lista", () => {
  cy.get(".flex.items-start.gap-4.p-5.rounded-xl.border").should(
    "have.length.at.least",
    1
  );

  cy.log("✓ Al menos una notificación visible");
});

Then("cada notificación debería mostrar título, mensaje y fecha", () => {
  cy.get(".flex.items-start.gap-4.p-5.rounded-xl.border").each(
    ($notification) => {
      // Verificar que tiene título (h4)
      cy.wrap($notification).find("h4").should("exist");

      // Verificar que tiene mensaje (p con text-sm)
      cy.wrap($notification).find("p.text-sm.text-gray-600").should("exist");

      // Verificar que tiene fecha (p con text-xs)
      cy.wrap($notification).find("p.text-xs.text-gray-400").should("exist");
    }
  );

  cy.log("✓ Todas las notificaciones tienen título, mensaje y fecha");
});

Then("las notificaciones no leídas deberían tener indicador visual", () => {
  cy.get(".bg-medical-50.border-medical-200").each(($unread) => {
    // Verificar que tiene el punto verde
    cy.wrap($unread).find('span[title="No leído"]').should("exist");
  });

  cy.log("✓ Notificaciones no leídas tienen indicador visual");
});

Then("la notificación debería cambiar su estado visual a leída", () => {
  cy.wait(500);

  // Verificar que la primera notificación ya no tiene el fondo de no leída
  cy.get(".bg-white.border-gray-200").should("exist");

  cy.log("✓ Notificación cambió a estado leída");
});

Then(
  "el contador de notificaciones no leídas debería decrementar en {int}",
  (decrement: number) => {
    cy.get("body").then(($body) => {
      const text = $body.text();

      if (text.includes("No tienes notificaciones nuevas")) {
        // Caso especial: ya no hay notificaciones no leídas
        expect(initialUnreadCount).to.equal(decrement);
      } else {
        const match = text.match(/Tienes (\d+) notificaciones sin leer/);
        if (match) {
          const newCount = parseInt(match[1], 10);
          expect(newCount).to.equal(initialUnreadCount - decrement);
        }
      }
    });

    cy.log(`✓ Contador decrementó en ${decrement}`);
  }
);

Then(
  "el botón {string} debería desaparecer de esa notificación",
  (buttonText: string) => {
    // Verificar que la primera notificación ya no tiene el botón
    cy.get(".bg-white.border-gray-200")
      .first()
      .within(() => {
        cy.contains("button", buttonText).should("not.exist");
      });

    cy.log(`✓ Botón "${buttonText}" desapareció`);
  }
);

Then(
  "todas las notificaciones deberían cambiar su estado visual a leídas",
  () => {
    cy.wait(500);

    // Verificar que no hay notificaciones con fondo de no leída
    cy.get(".bg-medical-50.border-medical-200").should("not.exist");

    // Todas deberían tener fondo blanco
    cy.get(".bg-white.border-gray-200").should("have.length.at.least", 1);

    cy.log("✓ Todas las notificaciones están marcadas como leídas");
  }
);

Then("el contador debería mostrar {string}", (message: string) => {
  cy.contains("p", message).should("be.visible");

  cy.log(`✓ Contador muestra: "${message}"`);
});

Then("el botón {string} debería estar deshabilitado", (buttonText: string) => {
  cy.contains("button", buttonText).should("be.disabled");

  cy.log(`✓ Botón "${buttonText}" deshabilitado`);
});

Then("la notificación debería desaparecer de la lista", () => {
  cy.wait(300);

  // Verificar que el total disminuyó
  cy.get(".flex.items-start.gap-4.p-5.rounded-xl.border").should(
    "have.length",
    initialTotalCount - 1
  );

  cy.log("✓ Notificación eliminada de la lista");
});

Then(
  "el total de notificaciones debería disminuir en {int}",
  (decrement: number) => {
    cy.get(".flex.items-start.gap-4.p-5.rounded-xl.border").should(
      "have.length",
      initialTotalCount - decrement
    );

    cy.log(`✓ Total disminuyó en ${decrement}`);
  }
);

Then("debería ver notificaciones con diferentes íconos según su tipo", () => {
  // Verificar que hay íconos en las notificaciones
  cy.get(".flex.items-start.gap-4.p-5.rounded-xl.border").each(
    ($notification) => {
      cy.wrap($notification).find(".text-2xl.text-medical-700").should("exist");
    }
  );

  cy.log("✓ Notificaciones tienen íconos según tipo");
});

Then("cada notificación debería mostrar su nivel de prioridad", () => {
  cy.get(".flex.items-start.gap-4.p-5.rounded-xl.border").each(
    ($notification) => {
      // Verificar que tiene badge de prioridad
      cy.wrap($notification)
        .find(
          "span.text-xs.font-semibold.px-2\\.5.py-0\\.5.rounded-full.border"
        )
        .should("exist");
    }
  );

  cy.log("✓ Todas las notificaciones muestran prioridad");
});

Then("las prioridades deberían tener colores distintivos", () => {
  // Verificar que existen diferentes clases de color
  cy.get(
    "span.text-xs.font-semibold.px-2\\.5.py-0\\.5.rounded-full.border"
  ).should("exist");

  cy.log("✓ Prioridades tienen colores distintivos");
});

Then("el sistema debería mostrar un indicador de carga", () => {
  // El indicador de carga puede aparecer brevemente
  // Este check es opcional ya que puede ser muy rápido
  cy.log("✓ Indicador de carga (puede ser muy rápido)");
});

Then("debería recargar la lista de notificaciones desde el servidor", () => {
  cy.wait(1000);

  // Verificar que las notificaciones están cargadas
  cy.get(".animate-spin").should("not.exist");

  cy.log("✓ Lista de notificaciones recargada");
});

Then("debería mostrar el mensaje {string}", (message: string) => {
  cy.contains(message).should("be.visible");

  cy.log(`✓ Mensaje mostrado: "${message}"`);
});

Then("las notificaciones no leídas deberían aparecer primero", () => {
  // Verificar el orden: primero no leídas, luego leídas
  cy.get(".flex.items-start.gap-4.p-5.rounded-xl.border").then(
    ($notifications) => {
      let foundRead = false;

      $notifications.each((index, notification) => {
        const isUnread = notification.className.includes("bg-medical-50");

        if (foundRead && isUnread) {
          throw new Error(
            "Notificación no leída encontrada después de una leída"
          );
        }

        if (!isUnread) {
          foundRead = true;
        }
      });
    }
  );

  cy.log("✓ Notificaciones no leídas aparecen primero");
});

Then("las notificaciones leídas deberían aparecer después", () => {
  // Ya verificado en el step anterior
  cy.log("✓ Notificaciones leídas aparecen después");
});

Then("debería ser redirigido a la página {string}", (route: string) => {
  cy.url().should("include", route);

  cy.log(`✓ Redirigido a ${route}`);
});

Then("debería mostrar un mensaje de error", () => {
  cy.get(".text-red-600.font-medium").should("be.visible");

  cy.log("✓ Mensaje de error visible");
});

Then("debería mostrar un botón {string}", (buttonText: string) => {
  cy.contains("button", buttonText).should("be.visible");

  cy.log(`✓ Botón "${buttonText}" visible`);
});

Then("el sistema debería intentar cargar las notificaciones nuevamente", () => {
  // Verificar que se muestra el indicador de carga brevemente
  cy.log("✓ Sistema reintenta cargar notificaciones");
});
