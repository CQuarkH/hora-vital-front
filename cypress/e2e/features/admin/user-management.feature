Feature: Gestión de Usuarios del Sistema
Como Administrador
Quiero poder crear, editar y desactivar usuarios
Para mantener el control de acceso del personal

Background:
Given un usuario "Admin" está autenticado
When navega a la página de "Gestión de Usuarios"

Scenario: Creación exitosa de un Secretario
When hago clic en el botón "Crear Usuario"
And lleno el formulario con nombre "Secretaria Demo", email "secre@demo.com", RUT "11.111.111-1"
And selecciono el rol "SECRETARY"
And hago clic en "Guardar"
Then debería ver el mensaje "Usuario creado con éxito"
And el usuario "Secretaria Demo" debería aparecer en la tabla de usuarios

Scenario: Intento de crear usuario con email duplicado
Given el email "paciente@test.com" ya existe en el sistema
When hago clic en el botón "Crear Usuario"
And lleno el formulario con email "paciente@test.com" y rol "PATIENT"
And hago clic en "Guardar"
Then debería ver un mensaje de error "El correo electrónico ya está en uso"
And el modal de creación no debería cerrarse

Scenario: Editar el rol de un usuario
Given existe un usuario "Secretaria Demo" con rol "SECRETARY"
When hago clic en "Editar" en la fila de "Secretaria Demo"
Then se abre el modal de edición
When cambio el rol a "ADMIN"
And hago clic en "Guardar Cambios"
Then la fila de "Secretaria Demo" debería mostrar el rol "ADMIN"