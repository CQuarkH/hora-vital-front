import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import UpdateAppointmentPage from '../../../src/pages/patient/UpdateAppointmentPage';
import { appointmentService } from '../../../src/services/appointments/appointment_service';

// Mocks
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ id: '1' })
    };
});

vi.mock('../../../src/context/AuthContext', () => ({
    useAuth: () => ({ user: { role: 'patient' } })
}));

vi.mock('../../../src/services/appointments/appointment_service', () => ({
    appointmentService: {
        getSpecialties: vi.fn(),
        getAppointmentById: vi.fn(),
        getDoctors: vi.fn(),
        getAvailability: vi.fn(),
        updateAppointment: vi.fn()
    }
}));

// Mock componentes complejos
vi.mock('../../../src/components/appointments/Calendar', () => ({
    Calendar: ({ onDateChange }: any) => (
        <button onClick={() => onDateChange(new Date('2024-02-01'))}>Seleccionar Fecha</button>
    )
}));

vi.mock('../../../src/components/appointments/TimeSlotPicker', () => ({
    TimeSlotPicker: ({ onTimeChange }: any) => (
        <button onClick={() => onTimeChange('10:00')}>Seleccionar Hora</button>
    )
}));

vi.mock('../../../src/components/appointments/AppointmentSummary', () => ({
    AppointmentSummary: ({ onConfirm }: any) => (
        <button onClick={onConfirm}>Confirmar Actualización</button>
    )
}));

describe('UpdateAppointmentPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (appointmentService.getSpecialties as any).mockResolvedValue([
            { id: '1', name: 'Cardiología' }
        ]);
        (appointmentService.getAppointmentById as any).mockResolvedValue({
            id: '1',
            specialty: { id: '1', name: 'Cardiología' },
            doctorProfile: { id: '1', user: { firstName: 'Dr.', lastName: 'House' } },
            appointmentDate: '2024-01-01',
            startTime: '09:00',
            notes: 'Nota original'
        });
        (appointmentService.getDoctors as any).mockResolvedValue([
            { id: '1', user: { firstName: 'Dr.', lastName: 'House' } }
        ]);
        (appointmentService.getAvailability as any).mockResolvedValue([
            { startTime: '10:00', isAvailable: true }
        ]);
    });

    it('debe cargar y mostrar los datos iniciales de la cita', async () => {
        render(
            <MemoryRouter>
                <UpdateAppointmentPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByDisplayValue('Nota original')).toBeInTheDocument();
            expect(screen.getByText('Editar Cita')).toBeInTheDocument();
        });
    });

    it('debe permitir actualizar la cita', async () => {
        (appointmentService.updateAppointment as any).mockResolvedValue({});
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <UpdateAppointmentPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Editar Cita')).toBeInTheDocument();
        });

        // Simular selección de fecha y hora (mocks)
        await user.click(screen.getByText('Seleccionar Fecha'));

        // Esperar a que cargue disponibilidad
        await waitFor(() => {
            expect(appointmentService.getAvailability).toHaveBeenCalled();
        });

        await user.click(screen.getByText('Seleccionar Hora'));

        // Confirmar
        await user.click(screen.getByText('Confirmar Actualización'));

        await waitFor(() => {
            expect(appointmentService.updateAppointment).toHaveBeenCalledWith('1', expect.objectContaining({
                startTime: '10:00'
            }));
            expect(mockNavigate).toHaveBeenCalledWith('/appointments/1');
        });
    });
});
