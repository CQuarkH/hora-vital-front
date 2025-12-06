Feature: Agendamiento de Cita Médica
  Como paciente registrado en HoraVital
  Quiero poder agendar una cita médica
  Para recibir atención en el centro de salud

  Background:
    Given un usuario "Paciente" está autenticado
    And navega a la página de "Agendar Cita"

  @e2e @real-backend
  Scenario: E2E 2 - Agendamiento exitoso de cita médica
    When el paciente selecciona la especialidad "Medicina General"
    And el paciente selecciona el médico "Luis Torres"
    And selecciona el día "15" del próximo mes en el calendario
    Then el sistema muestra los horarios disponibles para ese día
    When el paciente selecciona el horario "10:00"
    And hace clic en el botón "Confirmar Cita"
    Then debería ser redirigido a la página de confirmación

  @e2e @real-backend
  Scenario: Agendamiento con especialidad Cardiología
    When el paciente selecciona la especialidad "Cardiología"
    And el paciente selecciona el médico "Carlos Mendoza"
    And selecciona el día "16" del próximo mes en el calendario
    Then el sistema muestra los horarios disponibles para ese día
    When el paciente selecciona el horario "09:00"
    And hace clic en el botón "Confirmar Cita"
    Then debería ser redirigido a la página de confirmación

  @e2e @real-backend
  Scenario: Visualización de horarios disponibles según doctor
    When el paciente selecciona la especialidad "Pediatría"
    And el paciente selecciona el médico "Ana Silva"
    And selecciona el día "19" del próximo mes en el calendario
    Then el sistema muestra los horarios disponibles para ese día

  @validation
  Scenario: Validación - Intento de agendar sin seleccionar horario
    When el paciente selecciona la especialidad "Medicina General"
    And el paciente selecciona el médico "María Rodríguez"
    And selecciona el día "20" del próximo mes en el calendario
    Then el botón "Confirmar Agendamiento" no debería ser clickeable