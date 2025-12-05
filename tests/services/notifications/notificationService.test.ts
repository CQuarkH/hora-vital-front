import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest';
import axios from 'axios';
import { notificationService } from '../../../src/services/notifications/notificationService';

vi.mock('axios');
const mockedAxios = axios as Mocked<typeof axios>;

describe('NotificationService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    describe('getUserNotifications', () => {
        it('debe obtener notificaciones correctamente', async () => {
            const mockResponse = {
                data: {
                    notifications: [],
                    meta: { total: 0, page: 1, limit: 20, pages: 0 }
                }
            };
            mockedAxios.get.mockResolvedValue(mockResponse);

            const result = await notificationService.getUserNotifications();

            expect(result.success).toBe(true);
            expect(result.data).toEqual(mockResponse.data);
            expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/api/notifications'), expect.any(Object));
        });

        it('debe manejar errores al obtener notificaciones', async () => {
            mockedAxios.get.mockRejectedValue({
                response: { data: { message: 'Error de servidor' } }
            });

            const result = await notificationService.getUserNotifications();

            expect(result.success).toBe(false);
            expect(result.message).toBe('Error de servidor');
        });

        it('debe incluir el token en los headers si existe', async () => {
            const localStorageMock = {
                getItem: vi.fn(() => 'fake-token'),
                setItem: vi.fn(),
                removeItem: vi.fn(),
                clear: vi.fn(),
            };
            vi.stubGlobal('localStorage', localStorageMock);

            mockedAxios.get.mockResolvedValue({ data: {} });

            await notificationService.getUserNotifications();

            expect(mockedAxios.get).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        Authorization: 'Bearer fake-token'
                    })
                })
            );

            vi.unstubAllGlobals();
        });
    });

    describe('markAsRead', () => {
        it('debe marcar una notificación como leída', async () => {
            mockedAxios.patch.mockResolvedValue({ data: { id: '1', isRead: true } });

            const result = await notificationService.markAsRead('1');

            expect(result.success).toBe(true);
            // expect(result.id).toBe('1'); // Eliminado porque no existe en la interfaz
            expect(mockedAxios.patch).toHaveBeenCalledWith(
                expect.stringContaining('/api/notifications/1/read'),
                {},
                expect.any(Object)
            );
        });

        it('debe manejar errores al marcar como leída', async () => {
            mockedAxios.patch.mockRejectedValue(new Error('Network error'));

            const result = await notificationService.markAsRead('1');

            expect(result.success).toBe(false);
        });
    });

    describe('getUnreadCount', () => {
        it('debe retornar el número de notificaciones no leídas', async () => {
            const mockResponse = {
                data: {
                    notifications: [],
                    meta: { total: 5, page: 1, limit: 50, pages: 1 }
                }
            };
            mockedAxios.get.mockResolvedValue(mockResponse);

            const count = await notificationService.getUnreadCount();

            expect(count).toBe(5);
        });

        it('debe retornar 0 si hay error', async () => {
            mockedAxios.get.mockRejectedValue(new Error('Error'));

            const count = await notificationService.getUnreadCount();

            expect(count).toBe(0);
        });
    });
});
