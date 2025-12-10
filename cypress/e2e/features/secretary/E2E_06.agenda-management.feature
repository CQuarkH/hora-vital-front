Feature: CU-08 Gestión de Agenda y CU-09 Desplegar Calendario
  Como secretario/a del sistema
  Quiero poder administrar la disponibilidad horaria de los profesionales médicos
  Y visualizar un calendario interactivo con disponibilidad y citas
  Para gestionar eficientemente las agendas médicas

  Background:
    Given un usuario "Secretario" está autenticado

  # =============================================
  # CU-08: Gestión de Agenda - Flujo Principal
  # =============================================

  @cu08 @positivo
  Scenario: Acceder al módulo de gestión de agenda
    When navega a la sección "Gestión de Agenda"
    Then debería ver la página de gestión de horarios
    And debería ver el selector de médico
    And debería ver los bloques de disponibilidad por día

  @cu08 @positivo
  Scenario: Seleccionar un profesional médico y ver su agenda
    When navega a la sección "Gestión de Agenda"
    And selecciona un médico del selector
    Then debería ver la agenda actual del profesional
    And debería ver el resumen de citas y bloqueos

  @cu08 @positivo
  Scenario: Modificar bloque de disponibilidad existente
    When navega a la sección "Gestión de Agenda"
    And selecciona un médico del selector
    And modifica el horario del día "Martes" a "09:00" - "14:00"
    And hace clic en "Guardar Cambios"
    Then debería ver el mensaje "¡Horario actualizado exitosamente!"

  @cu08 @positivo
  Scenario: Bloquear horarios específicos sin conflictos
    When navega a la sección "Gestión de Agenda"
    And selecciona una fecha futura
    And selecciona un médico del selector
    And hace clic en "Bloquear Horario"
    Then debería ver el modal de bloqueo de horario
    When completa el formulario de bloqueo con fecha futura sin citas
    And hace clic en el botón "Bloquear Horario"
    Then debería ver el mensaje "Horario bloqueado exitosamente"

  @cu08 @positivo
  Scenario: Desbloquear período previamente bloqueado
    Given existe un período bloqueado para el médico seleccionado
    When navega a la sección "Gestión de Agenda"
    And selecciona una fecha futura
    And selecciona un médico del selector
    Then debería ver la lista de períodos bloqueados
    When hace clic en "Desbloquear"
    Then debería ver el mensaje "Período desbloqueado exitosamente"

  # =============================================
  # CU-08: Flujo Alternativo FA-01
  # =============================================

  @cu08 @alternativo @fa01
  Scenario: Bloquear horario sobre cita existente - Cancelar operación
    Given existen citas programadas para el médico seleccionado
    When navega a la sección "Gestión de Agenda"
    And selecciona un médico del selector
    And navega a la fecha con citas programadas
    And hace clic en "Bloquear Horario"
    And completa el formulario de bloqueo sobre el horario con cita
    And hace clic en el botón "Bloquear Horario"
    Then debería ver advertencia de citas programadas
    When hace clic en el botón "Volver"
    Then el modal de bloqueo debería mostrar el formulario inicial

  @cu08 @alternativo @fa01
  Scenario: Bloquear horario sobre cita existente - Confirmar cancelación
    Given existen citas programadas para el médico seleccionado
    When navega a la sección "Gestión de Agenda"
    And selecciona un médico del selector
    And navega a la fecha con citas programadas
    And hace clic en "Bloquear Horario"
    And completa el formulario de bloqueo sobre el horario con cita
    And hace clic en el botón "Bloquear Horario"
    Then debería ver advertencia de citas programadas
    When hace clic en el botón "Bloquear y Cancelar Citas"
    Then debería ver el mensaje "Horario bloqueado"
    And debería ver mensaje de citas canceladas

  # =============================================
  # CU-09: Desplegar Calendario - Flujo Principal
  # =============================================

  @cu09 @positivo
  Scenario: Ver calendario con vista previa
    When navega a la sección "Gestión de Agenda"
    And selecciona un médico del selector
    And hace clic en "Ver Calendario"
    Then debería ver el modal de vista previa del calendario

  @cu09 @positivo
  Scenario: Ver resumen de la agenda del día
    When navega a la sección "Gestión de Agenda"
    And selecciona un médico del selector
    Then debería ver el resumen de la agenda
    And debería ver el número de citas programadas
    And debería ver el número de períodos bloqueados
    And debería ver el estado del día

  @cu09 @positivo
  Scenario: Ver citas agendadas en la agenda
    Given existen citas programadas para el médico seleccionado
    When navega a la sección "Gestión de Agenda"
    And navega a la fecha con citas programadas
    And selecciona un médico del selector
    Then debería ver la lista de citas del día
    And cada cita debería mostrar horario y estado

  @cu09 @positivo
  Scenario: Ver horarios bloqueados en la agenda
    Given existen períodos bloqueados para el médico seleccionado
    When navega a la sección "Gestión de Agenda"
    And selecciona una fecha futura
    And selecciona un médico del selector
    Then debería ver la lista de períodos bloqueados
    And cada bloqueo debería mostrar fecha y hora

  @cu09 @positivo
  Scenario: Navegar entre fechas en la agenda
    When navega a la sección "Gestión de Agenda"
    And selecciona un médico del selector
    And cambia la fecha seleccionada
    Then debería actualizarse la información de la agenda

  # =============================================
  # CU-09: Flujo Alternativo FA-01
  # =============================================

  @cu09 @alternativo
  Scenario: Agenda sin datos configurados
    Given no hay datos de agenda configurados para el médico
    When navega a la sección "Gestión de Agenda"
    And selecciona el médico sin agenda configurada
    Then debería ver mensaje de no hay horarios configurados
    And el resumen debería mostrar cero citas y bloqueos

  # =============================================
  # Casos de Frontera
  # =============================================

  @frontera
  Scenario: Cambiar entre múltiples médicos
    When navega a la sección "Gestión de Agenda"
    And selecciona el primer médico del selector
    Then debería ver la agenda del primer médico
    When selecciona otro médico del selector
    Then debería ver la agenda del nuevo médico seleccionado
