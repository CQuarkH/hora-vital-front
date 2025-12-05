import { describe, it, expect, vi, beforeEach } from 'vitest';
import { appointmentService } from '../../../src/services/appointments/appointment_service';

global.fetch = vi.fn();

describe('AppointmentService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    describe('getSpecialties', () => {
        it('debe obtener especialidades', async () => {
            const mockData = [{ id: '1', name: 'Cardiología' }];
            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => mockData
            });

            const result = await appointmentService.getSpecialties();
            expect(result).toEqual(mockData);
        });
    });

    describe('getDoctors', () => {
        it('debe obtener doctores', async () => {
            const mockData = [{ id: '1', name: 'Dr. House' }];
            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => mockData
            });

            const result = await appointmentService.getDoctors();
            expect(result).toEqual(mockData);
        });

        it('debe obtener doctores filtrados por especialidad', async () => {
            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => []
            });

            await appointmentService.getDoctors('1');
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('specialtyId=1'),
                expect.any(Object)
            );
        });
    });

    describe('getAvailability', () => {
        it('debe obtener disponibilidad', async () => {
            const mockData = { availableSlots: [] };
            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => mockData
            });

            const result = await appointmentService.getAvailability(new Date());
            expect(result).toEqual([]);
        });
    });

    describe('createAppointment', () => {
        it('debe crear cita', async () => {
            const mockData = { appointment: { id: '1' } };
            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => mockData
            });

            const result = await appointmentService.createAppointment({} as any);
            expect(result).toEqual(mockData.appointment);
        });
    });

    describe('getMyAppointments', () => {
        it('debe obtener mis citas', async () => {
            const mockData = { appointments: [] };
            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => mockData
            });

            const result = await appointmentService.getMyAppointments();
            expect(result).toEqual([]);
        });
    });

    describe('cancelAppointment', () => {
        it('debe cancelar cita', async () => {
            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => ({ success: true })
            });

            await appointmentService.cancelAppointment('1', 'Razón');
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/appointments/1/cancel'),
                expect.objectContaining({ method: 'PATCH' })
            );
        });
    });

    describe('updateAppointment', () => {
        it('debe actualizar cita', async () => {
            const mockData = { appointment: { id: '1' } };
            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => mockData
            });

            const result = await appointmentService.updateAppointment('1', {});
            expect(result).toEqual(mockData.appointment);
        });
    });
});
