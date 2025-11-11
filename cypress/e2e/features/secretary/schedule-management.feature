Feature: Gestión de Horarios de Profesionales
Como Secretario
Quiero poder definir los bloques de horario de un profesional
Para que los pacientes puedan agendar citas en esos horarios

Background:
Given un usuario "Secretario" está autenticado
When navega a la página "Gestión de Horarios"

Scenario: Generar nuevos horarios para un profesional
When selecciono al profesional "Dr. Akel"
And marco el día "Lunes"
And defino la hora de inicio "09:00" y hora de fin "12:00"
And defino la duración de consulta como "30" minutos
And hago clic en "Generar Vista Previa"
Then debería ver los bloques "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"
When hago clic en "Guardar Horario"
Then debería ver un mensaje de "Horario guardado con éxito"

Scenario: Validación de horario inválido
When selecciono al profesional "Dr. Akel"
And marco el día "Martes"
And defino la hora de inicio "14:00" y hora de fin "13:00"
And defino la duración de consulta como "30" minutos
And hago clic en "Generar Vista Previa"
Then debería ver un mensaje de error "La hora de fin no puede ser anterior a la hora de inicio"