Feature: CU-10 Registrar Paciente
  Como personal administrativo del sistema (Admin/Secretario)
  Quiero poder crear una nueva cuenta de paciente
  Para registrar personas que solicitan atención médica

  Background:
    Given un usuario "Secretario" está autenticado

  Scenario: Registro exitoso de nuevo paciente por administrador
    When navega a la sección "Pacientes"
    And hace clic en el botón "Registrar Nuevo Paciente"
    Then debería estar en la página de creación de usuario
    When completa el formulario de nuevo usuario con:
      | firstName | Juana            |
      | lastName  | González         |
      | email     | juani.g@test.cl  |
      | rut       | 11.111.111-9     |
      | phone     | +56912345678     |
      | password  | Password123!     |
    And hace clic en "Registrar Usuario"
    Then debería ver el mensaje "creado exitosamente"

  Scenario: Error al registrar paciente con email duplicado
    When navega a la sección "Pacientes"
    And hace clic en el botón "Registrar Nuevo Paciente"
    Then debería estar en la página de creación de usuario
    And completa el formulario con email duplicado "paciente@horavital.cl"
    Then debería ver un mensaje de error sobre email duplicado

  Scenario: Error al registrar paciente con RUT duplicado
    When navega a la sección "Pacientes"
    And hace clic en el botón "Registrar Nuevo Paciente"
    Then debería estar en la página de creación de usuario
    And completa el formulario con rut duplicado "33.333.333-3"
    Then debería ver un mensaje de error sobre rut duplicado
