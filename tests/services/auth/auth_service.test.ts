import { describe, it, expect, vi, beforeEach } from 'vitest';

import { authService } from '../../../src/services/auth/auth_service';

import type { LoginCredentials, RegisterData } from '../../../src/types/auth/auth_types';



// Mock fetch global

const mockFetch = vi.fn();

global.fetch = mockFetch;



describe('AuthService', () => {

    beforeEach(() => {

        mockFetch.mockClear();

        vi.clearAllMocks();

    });



    describe('login', () => {

        const credentials: LoginCredentials = {

            rut: '12.345.678-5',

            password: 'password123',

        };



        it('debe realizar login exitoso y retornar usuario y token', async () => {

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



            const mockResponse = {

                data: {

                    token: 'fake-jwt-token',

                    user: mockUser,

                },

            };



            mockFetch.mockResolvedValueOnce({

                ok: true,

                json: async () => mockResponse,

            });



            const result = await authService.login(credentials);



            expect(result.success).toBe(true);

            expect(result.data).toBeDefined();

            expect(result.data?.token).toBe('fake-jwt-token');

            expect(result.data?.user).toEqual(mockUser);

            expect(mockFetch).toHaveBeenCalledWith(

                expect.stringContaining('/api/auth/login'),

                expect.objectContaining({

                    method: 'POST',

                    headers: { 'Content-Type': 'application/json' },

                    body: JSON.stringify({

                        rut: credentials.rut,

                        password: credentials.password,

                    }),

                })

            );

        });



        it('debe manejar error de credenciales inválidas', async () => {

            mockFetch.mockResolvedValueOnce({

                ok: false,

                status: 401,

                json: async () => ({

                    message: 'Credenciales inválidas',

                }),

            });



            const result = await authService.login(credentials);



            expect(result.success).toBe(false);

            expect(result.error).toBe('Credenciales inválidas');

        });



        it('debe manejar error de red', async () => {

            mockFetch.mockRejectedValueOnce(new Error('Network error'));



            const result = await authService.login(credentials);



            expect(result.success).toBe(false);

            expect(result.error).toContain('Network error');

        });



        it('debe manejar respuesta sin data', async () => {

            mockFetch.mockResolvedValueOnce({

                ok: true,

                json: async () => ({}),

            });



            const result = await authService.login(credentials);



            expect(result.success).toBe(false);

            expect(result.error).toBe('Error al iniciar sesión');

        });



        it('debe transformar usuario del backend correctamente', async () => {

            const backendUser = {

                id: '1',

                email: 'test@example.com',

                firstName: 'Juan',

                lastName: 'Pérez',

                role: 'admin',

                phone: '+56912345678',

                rut: '12.345.678-5',

            };



            mockFetch.mockResolvedValueOnce({

                ok: true,

                json: async () => ({

                    data: {

                        token: 'token',

                        user: backendUser,

                    },

                }),

            });



            const result = await authService.login(credentials);



            expect(result.success).toBe(true);

            expect(result.data?.user).toMatchObject({

                id: '1',

                email: 'test@example.com',

                firstName: 'Juan',

                lastName: 'Pérez',

                role: 'admin',

                phone: '+56912345678',

                rut: '12.345.678-5',

                isActive: true,

            });

            expect(result.data?.user.createdAt).toBeDefined();

            expect(result.data?.user.updatedAt).toBeDefined();

        });

    });



    describe('register', () => {

        const registerData: RegisterData = {

            email: 'newuser@example.com',

            password: 'password123',

            firstName: 'María',

            lastName: 'González',

            phone: '+56987654321',

            rut: '11.111.111-1',

            birthDate: '1990-01-01',

            gender: 'female',

            address: 'Calle Falsa 123',

        };



        it('debe registrar usuario exitosamente', async () => {

            const mockUser = {

                id: '2',

                email: registerData.email,

                firstName: registerData.firstName,

                lastName: registerData.lastName,

                phone: registerData.phone,

                rut: registerData.rut,

                role: 'patient',

                isActive: true,

                createdAt: '2024-01-01T00:00:00.000Z',

                updatedAt: '2024-01-01T00:00:00.000Z',

                birthDate: registerData.birthDate,

                gender: registerData.gender,

                address: registerData.address,

            };



            mockFetch.mockResolvedValueOnce({

                ok: true,

                json: async () => ({

                    data: {

                        token: 'new-jwt-token',

                        user: mockUser,

                    },

                }),

            });



            const result = await authService.register(registerData);



            expect(result.success).toBe(true);

            expect(result.data).toBeDefined();

            expect(result.data?.token).toBe('new-jwt-token');

            expect(result.data?.user).toMatchObject({

                email: registerData.email,

                firstName: registerData.firstName,

                lastName: registerData.lastName,

            });

            expect(mockFetch).toHaveBeenCalledWith(

                expect.stringContaining('/api/auth/register'),

                expect.objectContaining({

                    method: 'POST',

                    body: JSON.stringify(registerData),

                })

            );

        });



        it('debe manejar error de email duplicado', async () => {

            mockFetch.mockResolvedValueOnce({

                ok: false,

                status: 400,

                json: async () => ({

                    error: 'El email ya está registrado',

                }),

            });



            const result = await authService.register(registerData);



            expect(result.success).toBe(false);

            expect(result.error).toBe('El email ya está registrado');

        });



        it('debe manejar error de RUT duplicado', async () => {

            mockFetch.mockResolvedValueOnce({

                ok: false,

                status: 400,

                json: async () => ({

                    message: 'El RUT ya está registrado',

                }),

            });



            const result = await authService.register(registerData);



            expect(result.success).toBe(false);

            expect(result.error).toBe('El RUT ya está registrado');

        });



        it('debe manejar error de conexión', async () => {

            mockFetch.mockRejectedValueOnce(new Error('Connection timeout'));



            const result = await authService.register(registerData);



            expect(result.success).toBe(false);

            expect(result.error).toContain('Connection timeout');

        });



        it('debe manejar campos opcionales ausentes', async () => {

            const minimalData: RegisterData = {

                email: 'minimal@example.com',

                password: 'pass123',

                firstName: 'Test',

                lastName: 'User',

                phone: '+56900000000',

                rut: '22.222.222-2',

            };



            const mockUser = {

                id: '3',

                email: minimalData.email,

                firstName: minimalData.firstName,

                lastName: minimalData.lastName,

                phone: minimalData.phone,

                rut: minimalData.rut,

                role: 'patient',

                isActive: true,

                createdAt: '2024-01-01T00:00:00.000Z',

                updatedAt: '2024-01-01T00:00:00.000Z',

            };



            mockFetch.mockResolvedValueOnce({

                ok: true,

                json: async () => ({

                    data: {

                        token: 'token',

                        user: mockUser,

                    },

                }),

            });



            const result = await authService.register(minimalData);



            expect(result.success).toBe(true);

            expect(result.data?.user.birthDate).toBeUndefined();

            expect(result.data?.user.gender).toBeUndefined();

            expect(result.data?.user.address).toBeUndefined();

        });

    });



    describe('verifyToken', () => {

        it('debe retornar true para token válido', async () => {

            mockFetch.mockResolvedValueOnce({

                ok: true,

                json: async () => ({ data: {} }),

            });



            const result = await authService.verifyToken('valid-token');



            expect(result).toBe(true);

            expect(mockFetch).toHaveBeenCalledWith(

                expect.stringContaining('/api/profile'),

                expect.objectContaining({

                    method: 'GET',

                    headers: expect.objectContaining({

                        'Authorization': 'Bearer valid-token',

                    }),

                })

            );

        });



        it('debe retornar false para token inválido', async () => {

            mockFetch.mockResolvedValueOnce({

                ok: false,

                status: 401,

                json: async () => ({ error: 'Invalid token' }),

            });



            const result = await authService.verifyToken('invalid-token');



            expect(result).toBe(false);

        });



        it('debe retornar false para token vacío', async () => {

            const result = await authService.verifyToken('');



            expect(result).toBe(false);

            expect(mockFetch).not.toHaveBeenCalled();

        });



        it('debe manejar error de red y retornar false', async () => {

            mockFetch.mockRejectedValueOnce(new Error('Network error'));



            const result = await authService.verifyToken('token');



            expect(result).toBe(false);

        });

    });



    describe('Transformación de usuario', () => {

        it('debe llenar campos opcionales con valores por defecto', async () => {

            const credentials: LoginCredentials = {

                rut: '12.345.678-5',

                password: 'password123',

            };



            const backendUser = {

                id: '1',

                email: 'test@example.com',

                firstName: 'Juan',

                lastName: 'Pérez',

                role: 'patient',

            };



            mockFetch.mockResolvedValueOnce({

                ok: true,

                json: async () => ({

                    data: {

                        token: 'token',

                        user: backendUser,

                    },

                }),

            });



            const result = await authService.login(credentials);



            expect(result.success).toBe(true);

            expect(result.data?.user.phone).toBe('');

            expect(result.data?.user.rut).toBe('');

            expect(result.data?.user.isActive).toBe(true);

        });



        it('debe preservar isActive cuando es false', async () => {

            const credentials: LoginCredentials = {

                rut: '12.345.678-5',

                password: 'password123',

            };



            const backendUser = {

                id: '1',

                email: 'test@example.com',

                firstName: 'Juan',

                lastName: 'Pérez',

                role: 'patient',

                isActive: false,

                phone: '+56912345678',

                rut: '12.345.678-5',

            };



            mockFetch.mockResolvedValueOnce({

                ok: true,

                json: async () => ({

                    data: {

                        token: 'token',

                        user: backendUser,

                    },

                }),

            });



            const result = await authService.login(credentials);



            expect(result.success).toBe(true);

            expect(result.data?.user.isActive).toBe(false);

        });

    });

});