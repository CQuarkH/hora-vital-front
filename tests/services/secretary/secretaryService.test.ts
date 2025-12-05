import { describe, it, expect, vi, beforeEach } from 'vitest';
import { secretaryService } from '../../../src/services/secretary/secretaryService';

global.fetch = vi.fn();

describe('SecretaryService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    describe('createPatient', () => {
        it('debe crear un paciente exitosamente', async () => {
            const mockData = { firstName: 'Juan', lastName: 'Pérez', email: 'juan@test.com', password: 'pass', rut: '1-9' };
            const mockResponse = { id: '1', ...mockData };

            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => mockResponse
            });

            const result = await secretaryService.createPatient(mockData);

            expect(result).toEqual(mockResponse);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/secretary/patients'),
                expect.objectContaining({ method: 'POST' })
            );
        });

        it('debe lanzar error si falla la creación', async () => {
            (global.fetch as any).mockResolvedValue({
                ok: false,
                json: async () => ({ message: 'Error creating patient' })
            });

            await expect(secretaryService.createPatient({} as any)).rejects.toThrow('Error creating patient');
        });
    });

    describe('getDoctorAgenda', () => {
        it('debe obtener la agenda del doctor', async () => {
            const mockAgenda = { doctor: { id: '1', name: 'Dr. House' }, schedules: [] };
            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => mockAgenda
            });

            const result = await secretaryService.getDoctorAgenda('1', '2024-01-01');

            expect(result).toEqual(mockAgenda);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/secretary/agenda/1?date=2024-01-01'),
                expect.any(Object)
            );
        });
    });

    describe('updateSchedule', () => {
        it('debe actualizar el horario', async () => {
            const mockData = { isActive: false };
            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => ({ success: true })
            });

            await secretaryService.updateSchedule('1', mockData);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/secretary/schedules/1'),
                expect.objectContaining({ method: 'PUT' })
            );
        });
    });

    describe('blockPeriod', () => {
        it('debe bloquear un periodo', async () => {
            const mockData = { doctorProfileId: '1', startDateTime: '2024-01-01T10:00', endDateTime: '2024-01-01T11:00' };
            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => ({ id: 'block-1' })
            });

            await secretaryService.blockPeriod(mockData);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/secretary/blocks'),
                expect.objectContaining({ method: 'POST' })
            );
        });
    });

    describe('unblockPeriod', () => {
        it('debe desbloquear un periodo', async () => {
            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => ({ success: true })
            });

            await secretaryService.unblockPeriod('block-1');

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/secretary/blocks/block-1'),
                expect.objectContaining({ method: 'DELETE' })
            );
        });
    });
});
