Feature: Ver Pacientes (Administración)
  Como secretario registrado en HoraVital
  Quiero poder ver la lista de pacientes registrados
  Para gestionar sus datos y citas

  Background:
    Given un usuario "Secretario" está autenticado

  Scenario: Ver lista completa de pacientes
    When navega a la sección "Pacientes"
    Then debería ver una lista de pacientes
    And cada paciente debería tener su "Nombre", "RUT", "Email", "Teléfono", "Acciones"
    And debería ver al menos 3 pacientes en la lista

  Scenario: Buscar paciente por nombre
    When navega a la sección "Pacientes"
    And escribe "Juan" en el campo de búsqueda
    Then debería ver solo pacientes con nombre que contenga "Juan"
    And debería ver "Juan Pérez" en los resultados

  Scenario: Buscar paciente por RUT
    When navega a la sección "Pacientes"
    And escribe "33.333.333-3" en el campo de búsqueda
    Then debería ver exactamente 1 paciente en los resultados
    And el paciente mostrado debería tener RUT "33.333.333-3"

  Scenario: Filtrar pacientes por estado
    When navega a la sección "Pacientes"
    And selecciona el filtro "Estado" con valor "Activo"
    Then debería ver solo pacientes con estado "Activo"
    And no debería ver pacientes inactivos


  Scenario: Lista vacía cuando no hay pacientes que coincidan
    When navega a la sección "Pacientes"
    And escribe "XYZ123NoExiste" en el campo de búsqueda
    Then debería ver el mensaje "No se encontraron pacientes"

