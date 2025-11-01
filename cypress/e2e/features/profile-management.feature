Feature: Gestión de perfil y preferencias
  Como usuario autenticado
  Quiero poder editar mi información personal
  Para mantener mis datos actualizados

  Background:
    Given que estoy autenticado como "usuario@test.com" con contraseña "Test123456"

  Scenario: Editar información del perfil exitosamente
    Given que estoy en la página de perfil
    When hago clic en el botón "Editar Perfil"
    And actualizo mi nombre a "Juan Carlos"
    And actualizo mi apellido a "Pérez González"
    And actualizo mi dirección a "Av. Principal 123, Santiago"
    And actualizo mi teléfono a "+56 9 8765 4321"
    And hago clic en "Guardar Cambios"
    Then debería ver los campos deshabilitados nuevamente
    And debería ver mis datos actualizados en el perfil

  Scenario: Cancelar edición de perfil
    Given que estoy en la página de perfil
    When hago clic en el botón "Editar Perfil"
    And modifico mi nombre a "Nombre Temporal"
    And hago clic en "Cancelar"
    Then debería ver los campos deshabilitados nuevamente
    And debería ver el nombre original sin cambios

  Scenario: Validación de formato de correo en perfil
    Given que estoy en la página de perfil
    When hago clic en el botón "Editar Perfil"
    And intento cambiar mi correo a "correo-invalido"
    And hago clic en "Guardar Cambios"
    Then debería ver un mensaje de error "Correo electrónico inválido"
    And los cambios no deberían guardarse

  Scenario: Validación de campos obligatorios en perfil
    Given que estoy en la página de perfil
    When hago clic en el botón "Editar Perfil"
    And borro el contenido del campo de nombres
    And borro el contenido del campo de apellidos
    And hago clic en "Guardar Cambios"
    Then debería ver un mensaje de error "Los nombres son requeridos"
    And debería ver un mensaje de error "Los apellidos son requeridos"

  Scenario: Verificar campos no editables
    Given que estoy en la página de perfil
    Then el campo "RUT" debería estar deshabilitado
    And el campo "Fecha de Nacimiento" debería estar deshabilitado
    And el campo "Género" debería estar deshabilitado