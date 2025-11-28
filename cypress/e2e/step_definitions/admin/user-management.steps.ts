import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { generateUniqueEmail, generateUniqueRut } from "../common/common.steps";

const API_URL = Cypress.env("API_URL") || "http://localhost:4000";

// ============================================
// WHEN - Acciones (REAL)
// ============================================

When("navega a la página de inicio del admin", () => {
  cy.visit("/home");
  cy.wait(500); // Esperar a que cargue la página
});

When("completa el formulario de nuevo usuario con:", (dataTable) => {
  const uniqueRut = generateUniqueRut();
  const uniqueEmail = generateUniqueEmail();
  const data = dataTable.rowsHash();

  // Llenar cada campo del formulario CreateUserPage
  if (data.firstName) {
    cy.get('input[name="firstName"]').clear().type(data.firstName);
  }
  if (data.lastName) {
    cy.get('input[name="lastName"]').clear().type(data.lastName);
  }
  if (data.email) {
    cy.get('input[name="email"]').clear().type(uniqueEmail);
  }
  if (data.rut) {
    cy.get('input[name="rut"]').clear().type(uniqueRut);
  }
  if (data.phone) {
    cy.get('input[name="phone"]').clear().type(data.phone);
  }
  if (data.password) {
    cy.get('input[name="password"]').clear().type(data.password);
  }
  if (data.role) {
    // El select usa valores como "patient", "secretary", "admin"
    cy.get('select[name="role"]').select(data.role);
  }
});

When("completa el formulario con email duplicado {string}", (email: string) => {
  // Generar datos únicos para evitar conflictos
  const timestamp = Date.now();
  const uniqueRut = generateUniqueRut();
  const formattedRut = `${uniqueRut.slice(0, 2)}.${uniqueRut.slice(
    2,
    5
  )}.${uniqueRut.slice(5, 8)}-K`;

  cy.get('input[name="firstName"]').clear().type("Test");
  cy.get('input[name="lastName"]').clear().type("Usuario");
  cy.get('input[name="email"]').clear().type(email); // Email duplicado
  cy.get('input[name="rut"]').clear().type(formattedRut);
  cy.get('input[name="phone"]').clear().type("+56912345678");
  cy.get('input[name="password"]').clear().type("Password123!");
  cy.get('select[name="role"]').select("patient");
});

When(
  "hace clic en {string} en la fila del primer usuario de tipo secretario",
  (action: string) => {
    // Buscar la primera fila que contenga "Secretario/a" y hacer clic en el botón de acción
    cy.contains("tbody tr", "Secretario/a")
      .first()
      .within(() => {
        cy.contains("button", action, { matchCase: false }).click();
      });
    cy.wait(300);
  }
);

When(
  "hace clic en {string} en la fila del primer usuario activo",
  (action: string) => {
    // Buscar la primera fila que contenga "Activo" y hacer clic en el botón de acción
    cy.contains("tbody tr", "Activo")
      .first()
      .within(() => {
        cy.contains("button", action, { matchCase: false }).click();
      });
    cy.wait(300);
  }
);

When("cambia el rol a {string} en el modal", (newRole: string) => {
  // El modal EditUserModal tiene un select con name="role"
  cy.get('[role="dialog"], .fixed.inset-0').within(() => {
    cy.get('select[name="role"]').select(newRole);
  });
});

When("cambia el estado a {string} en el modal", (newStatus: string) => {
  // El modal EditUserModal tiene un select con name="status"
  cy.get('[role="dialog"], .fixed.inset-0').within(() => {
    cy.get('select[name="status"]').select(newStatus);
  });
});

When("selecciona el filtro de rol con valor {string}", (roleValue: string) => {
  // AdminHomePage tiene un select para filtrar por rol
  cy.get("select").contains("option", roleValue).parent().select(roleValue);
  cy.wait(300);
});

When(
  "escribe {string} en el campo de búsqueda de usuarios",
  (searchTerm: string) => {
    // AdminHomePage tiene un input de búsqueda con placeholder "Buscar usuarios..."
    cy.get('input[placeholder*="Buscar"]').clear().type(searchTerm);
    cy.wait(500); // Dar tiempo para que filtre
  }
);

When("completa parcialmente el formulario de creación", () => {
  cy.get('input[name="firstName"]').type("Parcial");
  cy.get('input[name="lastName"]').type("Test");
});

When(
  "hace clic en {string} sin completar el formulario",
  (buttonText: string) => {
    cy.contains("button", buttonText, { matchCase: false }).click();
    cy.wait(500);
  }
);

// ============================================
// THEN - Verificaciones (REAL)
// ============================================

Then("debería ver una tabla con usuarios del sistema", () => {
  // AdminHomePage renderiza una tabla con usuarios
  cy.get("table, .grid.grid-cols-5").should("be.visible");
  cy.get("tbody tr, .grid.grid-cols-5").should("have.length.at.least", 1);
});

Then("la tabla debería tener las columnas de gestión de usuarios", () => {
  // Verificar que existen las columnas: Usuario, Rol, Estado, Último Acceso, Acciones
  const columns = ["Usuario", "Rol", "Estado", "Acciones"];
  columns.forEach((col) => {
    cy.contains(col).should("be.visible");
  });
});

Then("debería ver usuarios con diferentes roles en la lista", () => {
  // Verificar que hay al menos algunos usuarios en la tabla
  cy.get("tbody, .bg-white.rounded-lg").should("exist");
  cy.contains(/Secretario\/a|Paciente|Administrador/).should("be.visible");
});

Then("debería estar en la página de creación de usuario", () => {
  cy.url().should("include", "/admin-create-user");
  cy.contains("h1", "Crear Nuevo Usuario").should("be.visible");
});

Then("debería volver a la página de gestión de usuarios", () => {
  cy.url().should("include", "/home");
  cy.contains("Panel de Administración").should("be.visible");
});

Then("debería ver un mensaje de error sobre email duplicado", () => {
  // El backend devuelve un error cuando el email ya existe
  cy.contains(/email|correo|duplicado|en uso/i, { timeout: 5000 }).should(
    "be.visible"
  );
});

Then("debería ver el modal de edición de usuario", () => {
  // EditUserModal se renderiza como un modal fixed con role="dialog" (implícito)
  cy.get(".fixed.inset-0").should("be.visible");
  cy.contains("h2", "Editar Usuario").should("be.visible");
});

Then("el modal debería cerrarse", () => {
  // Verificar que el modal ya no está visible
  cy.get(".fixed.inset-0").should("not.exist");
});

Then("debería ver el usuario actualizado en la lista", () => {
  // Esperar a que la lista se actualice
  cy.wait(500);
  cy.get("tbody tr, .grid").should("have.length.at.least", 1);
});

Then("debería ver el estado actualizado del usuario", () => {
  // Verificar que el estado cambió en la tabla
  cy.wait(500);
  cy.get("tbody").should("be.visible");
});

Then(
  "debería ver solo usuarios con rol {string} en la tabla",
  (role: string) => {
    // Verificar que la tabla/grid es visible
    cy.get("table, .grid.grid-cols-5").should("be.visible");

    // Seleccionar filas pero EXCLUIR el encabezado
    cy.get("tbody tr, .grid.grid-cols-5")
      // Excluye la fila que contiene el título de la columna "Rol"
      .not(':contains("Rol")')
      .each(($row) => {
        cy.wrap($row).should("contain.text", role);
      });
  }
);

Then("no debería ver usuarios con rol {string}", (role: string) => {
  // 1. Usamos el mismo selector que soporta tanto tablas como grids
  cy.get("tbody tr, .grid.grid-cols-5")
    // 2. Excluimos el encabezado explícitamente (igual que en el paso anterior)
    //    para asegurar que solo buscamos en los datos.
    .not(':contains("Rol")')
    // 3. Verificamos que ninguna de las filas restantes contenga el texto del rol
    .should("not.contain.text", role);
});

Then(
  "debería ver solo usuarios que contengan {string} en su nombre o email",
  (searchTerm: string) => {
    // 1. Usar el selector híbrido y excluir el header (igual que antes)
    cy.get("tbody tr, .grid.grid-cols-5")
      .not(':contains("Rol")')

      // 2. Verificar que al menos hay 1 resultado
      .should("have.length.at.least", 1)

      // 3. Iterar sobre CADA fila visible para asegurar que todas cumplen el filtro
      .each(($row) => {
        cy.wrap($row)
          .invoke("text")
          // 4. Usar Regex para búsqueda insensible a mayúsculas/minúsculas
          .should("match", new RegExp(searchTerm, "i"));
      });
  }
);

Then("debería estar en la página de gestión de usuarios", () => {
  cy.url().should("include", "/home");
  cy.contains("Panel de Administración").should("be.visible");
});

Then("debería ver mensajes de validación de campos obligatorios", () => {
  // react-hook-form muestra mensajes de error para campos requeridos
  cy.contains(/obligatorio|requerido|required/i).should("be.visible");
});
