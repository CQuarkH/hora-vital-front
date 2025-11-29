Feature: Editar Cita Para Paciente (Administración)
  Como secretario registrado en HoraVital
  Quiero editar la cita de un paciente
  Para ajustar horarios o ayudarle al paciente en el proceso

  Background:
    Given un usuario "Secretario" está autenticado

  Scenario: Reprogramar cita exitosamente
    When navega a la sección "Administración de Citas"
    And selecciona editar en la cita de "Cardiología" del día "25"
    Then debería ver el formulario de reprogramación
    When selecciona el nuevo día "29" del calendario
    And selecciona el nuevo horario "12:00"
    And hace clic en "Confirmar Cita"
    Then debería ver el mensaje "Cita actualizada exitosamente"