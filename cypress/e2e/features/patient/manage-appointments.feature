Feature: Gestión de Mis Citas
Como Paciente
Quiero poder ver y cancelar mis citas
Para administrar mi agenda personal

Background:
Given un usuario "Paciente" está autenticado
And el paciente tiene una "Cita de Cardiología" próxima
And el paciente tiene una "Cita de Dermatología" pasada
When navega a la página "Mis Citas"

Scenario: Visualización de citas próximas y pasadas
Then debería ver la "Cita de Cardiología" en la pestaña "Próximas"
When hace clic en la pestaña "Pasadas"
Then debería ver la "Cita de Dermatología" en la lista de pasadas

Scenario: Cancelación exitosa de una cita
Given el paciente está en la pestaña "Próximas"
When hace clic en el botón "Cancelar" de la "Cita de Cardiología"
Then se abre un modal de confirmación
When hace clic en el botón "Confirmar Cancelación" en el modal
Then debería ver el mensaje "Cita cancelada correctamente"
And la "Cita de Cardiología" ya no debería aparecer en la lista "Próximas"

Scenario: Abortar cancelación de una cita
Given el paciente está en la pestaña "Próximas"
When hace clic en el botón "Cancelar" de la "Cita de Cardiología"
Then se abre un modal de confirmación
When hace clic en el botón "Volver" (o "Cerrar") en el modal
Then el modal se cierra
And la "Cita de Cardiología" aún debe estar en la lista "Próximas"