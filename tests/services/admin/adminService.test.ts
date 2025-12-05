import { describe, it, expect, vi, beforeEach } from 'vitest';
import { adminService } from '../../../src/services/admin/adminService';

global.fetch = vi.fn();

describe('AdminService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    describe('getUsers', () => {
        it('debe obtener usuarios', async () => {
            const mockResponse = { users: [], meta: { total: 0 } };
            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => mockResponse
            });

            const result = await adminService.getUsers({ page: 1, limit: 10 });

            expect(result).toEqual(mockResponse);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/admin/users'),
                expect.any(Object)
            );
        });
    });

    describe('createUser', () => {
        it('debe crear usuario', async () => {
            const mockData = { firstName: 'Test', lastName: 'User', email: 'test@test.com', password: '123', rut: '1-9' };
            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => ({ id: '1', ...mockData })
            });

            await adminService.createUser(mockData);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/admin/users'),
                expect.objectContaining({ method: 'POST' })
            );
        });
    });

    describe('updateUser', () => {
        it('debe actualizar usuario', async () => {
            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => ({ success: true })
            });

            await adminService.updateUser('1', { firstName: 'Updated' });

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/admin/users/1'),
                expect.objectContaining({ method: 'PUT' })
            );
        });
    });

    describe('setUserStatus', () => {
        it('debe cambiar estado de usuario', async () => {
            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => ({ success: true })
            });

            await adminService.setUserStatus('1', true);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/admin/users/1/status'),
                expect.objectContaining({ method: 'PATCH' })
            );
        });
    });

    describe('getPatients', () => {
        it('debe obtener pacientes', async () => {
            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => ({ patients: [] })
            });

            await adminService.getPatients({ name: 'Test' });

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/admin/patients'),
                expect.any(Object)
            );
        });
    });

    describe('getAppointments', () => {
        it('debe obtener citas', async () => {
            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => ({ appointments: [] })
            });

            await adminService.getAppointments({ date: '2024-01-01' });

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/admin/appointments'),
                expect.any(Object)
            );
        });
    });

    describe('createSchedule', () => {
        it('debe crear horario', async () => {
            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => ({ success: true })
            });

            await adminService.createSchedule({ doctorProfileId: '1', dayOfWeek: 1, startTime: '09:00', endTime: '18:00' });

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/admin/schedules'),
                expect.objectContaining({ method: 'POST' })
            );
        });
    });
});
