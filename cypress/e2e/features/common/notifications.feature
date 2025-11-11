Feature: Centro de Notificaciones
  Como usuario
  Quiero recibir notificaciones sobre mis citas
  Para estar informado de cambios importantes

  Background:
    Given un usuario "Paciente" está autenticado
    And tiene "2" notificaciones no leídas

  Scenario: Ver notificaciones no leídas
    Then el ícono de la campana en el encabezado debería mostrar un badge con el número "2"
    When hago clic en el ícono de la campana
    Then se abre un panel desplegable
    And debería ver la notificación "Tu cita ha sido confirmada"
    And debería ver la notificación "Recordatorio: Tu cita es mañana"

  Scenario: Marcar una notificación como leída
    Given el panel de notificaciones está abierto
    When hago clic en la notificación "Tu cita ha sido confirmada"
    Then la notificación se marca como leída
    And el badge de la campana se actualiza a "1"