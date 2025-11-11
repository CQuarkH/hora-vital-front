Feature: Agendamiento de Citas
Como Paciente
Quiero poder agendar una nueva cita
Para recibir atención médica

Background:
Given un usuario "Paciente" está autenticado
And navega a la página de "Agendar Cita"

Scenario: Agendamiento exitoso en un horario disponible
When el paciente selecciona la especialidad "Cardiología"
And selecciona el día "20" del próximo mes en el calendario
Then el sistema muestra los horarios disponibles para ese día
When el paciente selecciona el horario "10:00 AM"
And hace clic en el botón "Confirmar Agendamiento"
Then debería ser redirigido a la página de confirmación
And debería ver el mensaje "Tu cita ha sido agendada con éxito"

Scenario: Visualización de horarios no disponibles
Given el sistema tiene horarios reservados para "Medicina General" el día "22"
When el paciente selecciona la especialidad "Medicina General"
And selecciona el día "22" del próximo mes en el calendario
Then el horario "09:00 AM" debería estar visible pero deshabilitado
And el horario "09:30 AM" debería estar habilitado

Scenario: Intento de agendar sin seleccionar un horario
When el paciente selecciona la especialidad "Cardiología"
And selecciona el día "20" del próximo mes en el calendario
And hace clic en el botón "Confirmar Agendamiento"
Then debería ver un mensaje de error "Debes seleccionar un horario disponible"
And el paciente permanece en la página de agendamiento