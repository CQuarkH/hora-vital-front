import { describe, it, expect, vi, beforeEach } from 'vitest';

import { userService, type UpdateProfilePayload } from '../../../src/services/user/user_service';



// Mock fetch global

const mockFetch = vi.fn();

global.fetch = mockFetch;



describe('UserService', () => {

    const mockToken = 'fake-jwt-token';



    beforeEach(() => {

        mockFetch.mockClear();

        vi.clearAllMocks();

    });



    describe('getProfile', () => {

        it('debe obtener el perfil del usuario correctamente', async () => {

            const mockUser = {

                id: '1',

                email: 'test@example.com',

                firstName: 'Juan',

                lastName: 'Pérez',

                phone: '+56912345678',

                rut: '12.345.678-5',

                role: 'patient',

                isActive: true,

                createdAt: '2024-01-01T00:00:00.000Z',

                updatedAt: '2024-01-01T00:00:00.000Z',

            };



            mockFetch.mockResolvedValueOnce({

                ok: true,

                json: async () => ({

                    data: mockUser,

                }),

            });



            const result = await userService.getProfile(mockToken);



            expect(result.success).toBe(true);

            expect(result.data).toEqual(mockUser);

            expect(mockFetch).toHaveBeenCalledWith(

                expect.stringContaining('/api/users/profile'),

                expect.objectContaining({

                    method: 'GET',

                    headers: {

                        'Content-Type': 'application/json',

                        'Authorization': `Bearer ${mockToken}`,

                    },

                })

            );

        });



        it('debe transformar name a firstName/lastName si viene del backend', async () => {

            const backendUser = {

                id: '1',

                email: 'test@example.com',

                name: 'Juan Pérez González',

                phone: '+56912345678',

                rut: '12.345.678-5',

                role: 'patient',

                isActive: true,

                createdAt: '2024-01-01T00:00:00.000Z',

                updatedAt: '2024-01-01T00:00:00.000Z',

            };



            mockFetch.mockResolvedValueOnce({

                ok: true,

                json: async () => ({

                    data: backendUser,

                }),

            });



            const result = await userService.getProfile(mockToken);



            expect(result.success).toBe(true);

            expect(result.data?.firstName).toBe('Juan');

            expect(result.data?.lastName).toBe('Pérez González');

        });



        it('debe manejar name con un solo nombre', async () => {

            const backendUser = {

                id: '1',

                email: 'test@example.com',

                name: 'Juan',

                phone: '+56912345678',

                rut: '12.345.678-5',

                role: 'patient',

                isActive: true,

                createdAt: '2024-01-01T00:00:00.000Z',

                updatedAt: '2024-01-01T00:00:00.000Z',

            };



            mockFetch.mockResolvedValueOnce({

                ok: true,

                json: async () => ({

                    data: backendUser,

                }),

            });



            const result = await userService.getProfile(mockToken);



            expect(result.success).toBe(true);

            expect(result.data?.firstName).toBe('Juan');

            expect(result.data?.lastName).toBe('');

        });



        it('debe manejar error de autenticación', async () => {

            mockFetch.mockResolvedValueOnce({

                ok: false,

                status: 401,

                json: async () => ({

                    message: 'Token inválido',

                }),

            });



            const result = await userService.getProfile(mockToken);



            expect(result.success).toBe(false);

            expect(result.error).toBe('Token inválido');

        });



        it('debe manejar error de red', async () => {

            mockFetch.mockRejectedValueOnce(new Error('Network error'));



            const result = await userService.getProfile(mockToken);



            expect(result.success).toBe(false);

            expect(result.error).toBe('Error de conexión con el servidor');

        });



        it('debe manejar respuesta sin data wrapper', async () => {

            const mockUser = {

                id: '1',

                email: 'test@example.com',

                firstName: 'Juan',

                lastName: 'Pérez',

                phone: '+56912345678',

                rut: '12.345.678-5',

                role: 'patient',

                isActive: true,

                createdAt: '2024-01-01T00:00:00.000Z',

                updatedAt: '2024-01-01T00:00:00.000Z',

            };



            mockFetch.mockResolvedValueOnce({

                ok: true,

                json: async () => mockUser,

            });



            const result = await userService.getProfile(mockToken);



            expect(result.success).toBe(true);

            expect(result.data).toEqual(mockUser);

        });

    });



    describe('updateProfile', () => {

        const updateData: UpdateProfilePayload = {

            firstName: 'Carlos',

            lastName: 'Silva',

            email: 'carlos.silva@example.com',

            phone: '+56987654321',

            address: 'Nueva Dirección 456',

        };



        it('debe actualizar el perfil correctamente', async () => {

            const updatedUser = {

                id: '1',

                email: updateData.email,

                firstName: updateData.firstName,

                lastName: updateData.lastName,

                phone: updateData.phone,

                rut: '12.345.678-5',

                role: 'patient',

                isActive: true,

                createdAt: '2024-01-01T00:00:00.000Z',

                updatedAt: '2024-01-02T00:00:00.000Z',

                address: updateData.address,

            };



            mockFetch.mockResolvedValueOnce({

                ok: true,

                json: async () => ({

                    data: updatedUser,

                }),

            });



            const result = await userService.updateProfile(mockToken, updateData);



            expect(result.success).toBe(true);

            expect(result.data).toEqual(updatedUser);

            expect(mockFetch).toHaveBeenCalledWith(

                expect.stringContaining('/api/users/profile'),

                expect.objectContaining({

                    method: 'PUT',

                    headers: {

                        'Content-Type': 'application/json',

                        'Authorization': `Bearer ${mockToken}`,

                    },

                    body: JSON.stringify(updateData),

                })

            );

        });



        it('debe actualizar solo campos específicos', async () => {

            const partialUpdate: UpdateProfilePayload = {

                firstName: 'Pedro',

            };



            const updatedUser = {

                id: '1',

                email: 'test@example.com',

                firstName: 'Pedro',

                lastName: 'Pérez',

                phone: '+56912345678',

                rut: '12.345.678-5',

                role: 'patient',

                isActive: true,

                createdAt: '2024-01-01T00:00:00.000Z',

                updatedAt: '2024-01-02T00:00:00.000Z',

            };



            mockFetch.mockResolvedValueOnce({

                ok: true,

                json: async () => ({

                    data: updatedUser,

                }),

            });



            const result = await userService.updateProfile(mockToken, partialUpdate);



            expect(result.success).toBe(true);

            expect(result.data?.firstName).toBe('Pedro');

        });



        it('debe manejar error de validación', async () => {

            mockFetch.mockResolvedValueOnce({

                ok: false,

                status: 400,

                json: async () => ({

                    error: {

                        message: 'Email inválido',

                    },

                }),

            });



            const result = await userService.updateProfile(mockToken, updateData);



            expect(result.success).toBe(false);

            expect(result.error).toBe('Email inválido');

        });



        it('debe manejar respuesta sin data', async () => {

            mockFetch.mockResolvedValueOnce({

                ok: true,

                json: async () => ({}),

            });



            const result = await userService.updateProfile(mockToken, updateData);



            expect(result.success).toBe(false);

            expect(result.error).toBe('Error desconocido');

        });



        it('debe manejar error de red', async () => {

            mockFetch.mockRejectedValueOnce(new Error('Connection timeout'));



            const result = await userService.updateProfile(mockToken, updateData);



            expect(result.success).toBe(false);

            expect(result.error).toBe('Error de conexión con el servidor');

        });



        it('debe manejar error de autenticación expirada', async () => {

            mockFetch.mockResolvedValueOnce({

                ok: false,

                status: 401,

                json: async () => ({

                    message: 'Token expirado',

                }),

            });



            const result = await userService.updateProfile(mockToken, updateData);



            expect(result.success).toBe(false);

            expect(result.error).toBe('Token expirado');

        });

    });



    describe('changePassword', () => {

        const currentPassword = 'oldPassword123';

        const newPassword = 'newPassword456';



        it('debe cambiar la contraseña correctamente', async () => {

            mockFetch.mockResolvedValueOnce({

                ok: true,

                json: async () => ({

                    data: {

                        message: 'Contraseña actualizada exitosamente',

                    },

                }),

            });



            const result = await userService.changePassword(

                mockToken,

                currentPassword,

                newPassword

            );



            expect(result.success).toBe(true);

            expect(result.data?.message).toBe('Contraseña actualizada exitosamente');

            expect(mockFetch).toHaveBeenCalledWith(

                expect.stringContaining('/api/profile/change-password'),

                expect.objectContaining({

                    method: 'PUT',

                    headers: {

                        'Content-Type': 'application/json',

                        'Authorization': `Bearer ${mockToken}`,

                    },

                    body: JSON.stringify({

                        currentPassword,

                        newPassword,

                    }),

                })

            );

        });



        it('debe manejar error de contraseña incorrecta', async () => {

            mockFetch.mockResolvedValueOnce({

                ok: false,

                status: 400,

                json: async () => ({

                    message: 'Contraseña actual incorrecta',

                }),

            });



            const result = await userService.changePassword(

                mockToken,

                'wrongPassword',

                newPassword

            );



            expect(result.success).toBe(false);

            expect(result.error).toBe('Contraseña actual incorrecta');

        });



        it('debe manejar error de validación de nueva contraseña', async () => {

            mockFetch.mockResolvedValueOnce({

                ok: false,

                status: 400,

                json: async () => ({

                    error: 'La contraseña debe tener al menos 8 caracteres',

                }),

            });



            const result = await userService.changePassword(

                mockToken,

                currentPassword,

                '123'

            );



            expect(result.success).toBe(false);

            expect(result.error).toBe('La contraseña debe tener al menos 8 caracteres');

        });



        it('debe manejar error de red', async () => {

            mockFetch.mockRejectedValueOnce(new Error('Network error'));



            const result = await userService.changePassword(

                mockToken,

                currentPassword,

                newPassword

            );



            expect(result.success).toBe(false);

            expect(result.error).toBe('Error de conexión con el servidor');

        });



        it('debe manejar token inválido', async () => {

            mockFetch.mockResolvedValueOnce({

                ok: false,

                status: 401,

                json: async () => ({

                    message: 'No autorizado',

                }),

            });



            const result = await userService.changePassword(

                'invalid-token',

                currentPassword,

                newPassword

            );



            expect(result.success).toBe(false);

            expect(result.error).toBe('No autorizado');

        });

    });

});