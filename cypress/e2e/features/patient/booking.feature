Feature: Agendamiento de Cita Médica
  Como Elías Currihuil, paciente registrado
  Quiero poder agendar una cita médica
  Para recibir atención en el centro de salud

  Background:
    Given un usuario "Paciente" está autenticado
    And navega a la página de "Agendar Cita"

  Scenario: E2E 2 - Agendamiento exitoso de cita para Elías Currihuil
    When el paciente selecciona la especialidad "Medicina General"
    And el paciente selecciona el médico "Dr. María Rodríguez"
    And selecciona el día "25" del próximo mes en el calendario
    Then el sistema muestra los horarios disponibles para ese día
    When el paciente selecciona el horario "10:00"
    And hace clic en el botón "Confirmar Agendamiento"
    Then debería ser redirigido a la página de confirmación

  Scenario: Visualización de horarios ocupados y disponibles
    Given el sistema tiene horarios reservados para "Medicina General" el día "26"
    When el paciente selecciona la especialidad "Medicina General"
    And el paciente selecciona el médico "Dr. María Rodríguez"
    And selecciona el día "26" del próximo mes en el calendario
    Then el horario "14:30" debería estar visible pero deshabilitado
    And el horario "11:30" debería estar habilitado

  Scenario: Validación - Intento de agendar sin seleccionar horario
    When el paciente selecciona la especialidad "Medicina General"
    And selecciona el día "25" del próximo mes en el calendario
    And el paciente selecciona el médico "Dr. María Rodríguez"
    Then el botón "Confirmar Agendamiento" no debería ser clickeable