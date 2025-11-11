Feature: Administración de Citas
  Como Secretario
  Quiero poder buscar, filtrar y gestionar todas las citas
  Para mantener el orden de la agenda del centro médico

  Background:
    Given un usuario "Secretario" está autenticado
    When navega a la página de "Administración de Citas"

  Scenario: Filtrar citas por profesional
    Given la tabla muestra citas de "Dr. Akel" y "Dra. Ana"
    When selecciono al profesional "Dr. Akel" en el filtro
    And hago clic en "Aplicar Filtro"
    Then la tabla solo debería mostrar citas del "Dr. Akel"
    And la tabla ya no debería mostrar citas de "Dra. Ana"

  Scenario: Buscar citas por paciente
    Given la tabla muestra citas de "Benjamin San Martin" y "Elias Currihuil"
    When escribo "Benjamin San Martin" en el buscador
    And hago clic en "Buscar"
    Then la tabla solo debería mostrar citas de "Benjamin San Martin"
    
  Scenario: Cancelar la cita de un paciente
    Given la tabla muestra la cita "cardio123" de "Benjamin San Martin"
    When hago clic en "Cancelar" en la fila de la cita "cardio123"
    And confirmo la cancelación en el modal
    Then la fila de la cita "cardio123" debería mostrar el estado "Cancelada"