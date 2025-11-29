Feature: Editar Cita Médica
  Como paciente con una cita agendada
  Quiero poder editar o reprogramar mi cita
  Para ajustarla a mi disponibilidad

  Background:
    Given un usuario "Paciente" está autenticado
    And el paciente tiene una cita agendada para "Cardiología" el día "25" a las "10:00 AM"

  Scenario: Reprogramar cita exitosamente
    When navega a la sección "Mis Citas"
    And selecciona la cita de "Cardiología" del día "25"
    And hace clic en el botón "Editar Cita"
    Then debería ver el formulario de reprogramación
    When selecciona el nuevo día "29" del calendario
    And selecciona el nuevo horario "12:00"
    And hace clic en "Confirmar Cita"
    Then debería ver el mensaje "Cita actualizada exitosamente"
    And la cita debería aparecer con la nueva fecha "29"
    And la cita debería aparecer con el nuevo horario "12:00"

  Scenario: Cancelar el proceso de reprogramación
    When navega a la sección "Mis Citas"
    And selecciona la cita de "Cardiología" del día "29"
    And hace clic en el botón "Editar Cita"
    And hace clic en el botón volver
    Then debería volver a la lista de citas
    And la cita debería aparecer con la nueva fecha "29"
    And la cita debería aparecer con el nuevo horario "12:00"
