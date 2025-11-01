Feature: Flujo completo paciente
  Como nuevo usuario
  Quiero registrarme, iniciar sesión y agendar mi primera cita
  Para poder usar el sistema de gestión médica

  Scenario: Desde registro hasta agendamiento de primera cita
    Given que accedo a la página de registro
    When completo el formulario de registro con datos válidos
      | firstName       | Juan                    |
      | lastName        | Pérez                   |
      | rut             | 12.345.678-9            |
      | birthDate       | 1990-05-15              |
      | email           | juan.perez@test.com     |
      | phone           | +56 9 1234 5678         |
      | password        | Test123456              |
      | confirmPassword | Test123456              |
    And envío el formulario de registro
    Then debería ser redirigido al home
    And debería estar autenticado correctamente

    When navego a la sección de agendar cita
    And selecciono una especialidad "Medicina General"
    And selecciono una fecha disponible
    And selecciono un horario disponible
    And confirmo el agendamiento
    Then debería ver un mensaje de confirmación de cita
    And debería ver mi cita en la lista de próximas citas

  Scenario: Validación de campos obligatorios en registro
    Given que accedo a la página de registro
    When envío el formulario de registro sin completar datos
    Then debería ver mensajes de error en campos obligatorios
    And no debería ser redirigido

  Scenario: Validación de formato de RUT
    Given que accedo a la página de registro
    When ingreso un RUT con formato inválido "12345678"
    And completo los demás campos correctamente
    And envío el formulario de registro
    Then debería ver un error de formato de RUT

  Scenario: Validación de contraseñas no coinciden
    Given que accedo a la página de registro
    When completo el formulario con contraseñas diferentes
      | password        | Test123456     |
      | confirmPassword | Test654321     |
    Then debería ver un error indicando que las contraseñas no coinciden