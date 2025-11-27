Feature: Ver Perfil de Usuario
  Como usuario autenticado del sistema
  Quiero poder ver mi información de perfil
  Para verificar que mis datos estén correctos
    

  Scenario: Ver perfil con información completa del paciente
    Given un usuario "Paciente" está autenticado
    When navega a la sección "Mi Perfil"
    Then debería ver su nombre completo
    And debería ver su email
    And debería ver su rol "Paciente"
    And debería ver su RUT "33.333.333-3"
    And debería ver su teléfono "+56933333333"

  Scenario: Ver perfil como secretario
    Given un usuario "Secretario" está autenticado
    When navega a la sección "Mi Perfil"
    Then debería ver su nombre completo
    And debería ver su email
    And debería ver su rol "Secretaria"

  Scenario: Ver perfil como administrador
    Given un usuario "Administrador" está autenticado
    When navega a la sección "Mi Perfil"
    Then debería ver su nombre completo
    And debería ver su email
    And debería ver su rol "Administrador"
