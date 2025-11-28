Feature: Gestión de Usuarios del Sistema
  Como administrador
  Quiero gestionar los usuarios del sistema
  Para controlar el acceso y roles de los usuarios

  Background:
    Given un usuario "Administrador" está autenticado

  Scenario: Ver lista de usuarios del sistema
    When navega a la página de inicio del admin
    Then debería ver una tabla con usuarios del sistema
    And la tabla debería tener las columnas de gestión de usuarios
    And debería ver usuarios con diferentes roles en la lista

  Scenario: Crear un nuevo secretario
    When navega a la página de inicio del admin
    And hace clic en el botón "Nuevo Usuario"
    Then debería estar en la página de creación de usuario
    When completa el formulario de nuevo usuario con:
      | firstName | Juana            |
      | lastName  | González         |
      | email     | juani.g@test.cl  |
      | rut       | 11.111.111-9     |
      | phone     | +56912345678     |
      | password  | Password123!     |
      | role      | secretary        |
    And hace clic en "Registrar Usuario"
    Then debería ver el mensaje "creado exitosamente"
    And debería volver a la página de gestión de usuarios

  Scenario: Intentar crear usuario con email duplicado
    When navega a la página de inicio del admin
    And hace clic en el botón "Nuevo Usuario"
    And completa el formulario con email duplicado "paciente@horavital.cl"
    And hace clic en "Registrar Usuario"
    Then debería ver un mensaje de error sobre email duplicado

  Scenario: Filtrar usuarios por rol
    When navega a la página de inicio del admin
    And selecciona el filtro de rol con valor "Secretario/a"
    Then debería ver solo usuarios con rol "Secretario/a" en la tabla
    And no debería ver usuarios con rol "Paciente"

  Scenario: Buscar usuario por nombre
    When navega a la página de inicio del admin
    And escribe "Juan" en el campo de búsqueda de usuarios
    Then debería ver solo usuarios que contengan "Juan" en su nombre o email

  Scenario: Cancelar creación de usuario
    When navega a la página de inicio del admin
    And hace clic en el botón "Nuevo Usuario"
    And completa parcialmente el formulario de creación
    And hace clic en el botón "Volver al Panel de Administración"
    Then debería estar en la página de gestión de usuarios

  Scenario: Validación de campos obligatorios al crear usuario
    When navega a la página de inicio del admin
    And hace clic en el botón "Nuevo Usuario"
    And hace clic en "Registrar Usuario" sin completar el formulario
    Then debería ver mensajes de validación de campos obligatorios
