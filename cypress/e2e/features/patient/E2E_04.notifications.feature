Feature: Ver Notificaciones
  Como paciente registrado en HoraVital
  Quiero poder visualizar mis notificaciones
  Para mantenerme informado sobre mis citas y actividades del sistema

  Background:
    Given un usuario "Paciente" está autenticado
    And existen notificaciones para el paciente
    And navega a la sección "Notificaciones"

  @e2e @real-backend
  Scenario: E2E 1 - Visualización exitosa de notificaciones pendientes
    When el sistema carga las notificaciones del usuario
    Then debería mostrar el título "Notificaciones"
    And debería ver al menos una notificación en la lista
    And cada notificación debería mostrar título, mensaje y fecha
    And las notificaciones no leídas deberían tener indicador visual

  @e2e @real-backend
  Scenario: E2E 2 - Marcar una notificación como leída
    Given hay notificaciones no leídas disponibles
    When el paciente hace clic en "Marcar como Leída" en la primera notificación no leída
    Then la notificación debería cambiar su estado visual a leída
    And el contador de notificaciones no leídas debería decrementar en 1
    And el botón "Marcar como Leída" debería desaparecer de esa notificación

  @e2e @real-backend
  Scenario: E2E 3 - Marcar todas las notificaciones como leídas
    Given hay notificaciones no leídas disponibles
    When el paciente hace clic en el botón "Marcar Todas como Leídas"
    Then todas las notificaciones deberían cambiar su estado visual a leídas
    And el contador debería mostrar "No tienes notificaciones nuevas"
    And el botón "Marcar Todas como Leídas" debería estar deshabilitado

  @e2e @real-backend
  Scenario: E2E 4 - Eliminar una notificación
    Given hay al menos una notificación visible
    When el paciente hace clic en el ícono de eliminar en una notificación
    Then la notificación debería desaparecer de la lista
    And el total de notificaciones debería disminuir en 1

  @e2e @real-backend
  Scenario: Visualización de diferentes tipos de notificaciones
    When el sistema carga las notificaciones del usuario
    Then debería ver notificaciones con diferentes íconos según su tipo
    And cada notificación debería mostrar su nivel de prioridad
    And las prioridades deberían tener colores distintivos

  @e2e @real-backend
  Scenario: Actualizar lista de notificaciones
    When el paciente hace clic en el botón "Actualizar"
    Then el sistema debería mostrar un indicador de carga
    And debería recargar la lista de notificaciones desde el servidor

  @e2e @real-backend @empty-state
  Scenario: FA-01 - No hay notificaciones disponibles
    Given el usuario no tiene notificaciones en el sistema
    When el sistema intenta cargar las notificaciones
    Then debería mostrar el mensaje "No tienes notificaciones en este momento."
    And el contador debería mostrar "No tienes notificaciones nuevas"
    And el botón "Marcar Todas como Leídas" debería estar deshabilitado