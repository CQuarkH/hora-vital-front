Feature: Flujo Registro Paciente
  Como nuevo usuario
  Quiero registrarme en el sistema HoraVital
  Para poder agendar citas médicas

  @e2e @real-backend
  Scenario: E2E 1 - Registro completo de nuevo paciente
    Given que accedo a la página de registro
    When completo el formulario de registro con datos válidos
      | firstName       | Juan                     |
      | lastName        | Pérez                    |
      | rut             | 21.600.919-3             |
      | birthDate       | 1995-03-15               |
      | email           | juan.perez@test.cl       |
      | phone           | +56987654321             |
      | password        | Password123!             |
      | confirmPassword | Password123!             |
    And envío el formulario de registro
    Then debería ser redirigido al home
    And debería estar autenticado correctamente

  @validation
  Scenario: Validación de campos obligatorios en registro
    Given que accedo a la página de registro
    When envío el formulario de registro sin completar datos
    Then debería ver mensajes de error en campos obligatorios
    And no debería ser redirigido al home

  @validation
  Scenario: Validación de formato de RUT
    Given que accedo a la página de registro
    When ingreso un RUT con formato inválido "12345678"
    And completo los demás campos correctamente
    And envío el formulario de registro
    Then debería ver un error de formato de RUT

  @validation
  Scenario: Validación de contraseñas no coinciden
    Given que accedo a la página de registro
    When completo el formulario con contraseñas diferentes
      | password        | Test123456!    |
      | confirmPassword | Test654321!    |
    Then debería ver un error indicando que las contraseñas no coinciden