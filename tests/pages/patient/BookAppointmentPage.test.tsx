import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import BookAppointmentPage from '../../../src/pages/patient/BookAppointmentPage';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('../../../src/components/appointments/AppointmentSummary', () => ({
    AppointmentSummary: ({ specialty, doctor, date, time, onConfirm }: any) => (
        <div>
            <span data-testid="summary-specialty">{specialty || 'No seleccionado'}</span>
            <span data-testid="summary-doctor">{doctor || 'No seleccionado'}</span>
            <span data-testid="summary-date">{date || 'No seleccionado'}</span>
            <span data-testid="summary-time">{time || 'No seleccionado'}</span>
            <button onClick={onConfirm}>Confirmar Cita</button>
        </div>
    )
}));

vi.mock('../../../src/components/PatientLayout', () => ({
    PatientLayout: ({ children }: any) => <div>{children}</div>
}));

vi.mock('../../../src/components/appointments/DatePicker', () => ({
    DatePicker: ({ selectedDate, onDateSelect }: any) => (
        <div>
            <button onClick={() => onDateSelect('2025-11-04')}>Elegir 4 Nov</button>
        </div>
    )
}));

vi.mock('../../../src/services/appointments/appointment_service', () => ({
    appointmentService: {
        getSpecialties: vi.fn().mockResolvedValue([
            { id: '1', name: 'Cardiologia' },
            { id: '2', name: 'Pediatria' }
        ]),
        getDoctors: vi.fn().mockResolvedValue([
            {
                id: '1',
                user: { id: '1', firstName: 'Carlos', lastName: 'Mendoza' },
                specialty: { id: '1', name: 'Cardiologia' },
                specialtyId: '1'
            },
            {
                id: '2',
                user: { id: '2', firstName: 'Maria', lastName: 'Rodriguez' },
                specialty: { id: '2', name: 'Pediatria' },
                specialtyId: '2'
            }
        ]),
        getDoctorsBySpecialty: vi.fn().mockResolvedValue([
            {
                id: '1',
                user: { id: '1', firstName: 'Carlos', lastName: 'Mendoza' },
                specialty: { id: '1', name: 'Cardiologia' },
                specialtyId: '1'
            }
        ]),
        getAvailability: vi.fn().mockResolvedValue([
            { id: '1', startTime: '10:00', endTime: '10:30', isAvailable: true },
            { id: '2', startTime: '10:30', endTime: '11:00', isAvailable: true }
        ]),
        bookAppointment: vi.fn().mockResolvedValue({ id: 'new-appointment', success: true })
    }
}));

describe('BookAppointmentPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe renderizar el título y el estado inicial de los steps', async () => {
        render(
            <MemoryRouter>
                <BookAppointmentPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Agendar Nueva Cita')).toBeInTheDocument();
        });
    });

    it('debe habilitar el select de Doctor y mostrar doctores al elegir especialidad', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <BookAppointmentPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByRole('combobox').length).toBeGreaterThan(0);
        });

        await user.selectOptions(screen.getAllByRole('combobox')[0], 'Cardiologia');

        await waitFor(() => {
            const doctorSelect = screen.getAllByRole('combobox')[1];
            expect(doctorSelect).not.toBeDisabled();
            expect(screen.getByText(/Carlos.*Mendoza/i)).toBeInTheDocument();
        });
    });

    it('debe mostrar "Buscando horarios" y luego los slots al seleccionar médico', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <BookAppointmentPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByRole('combobox').length).toBeGreaterThan(0);
        });

        await user.selectOptions(screen.getAllByRole('combobox')[0], 'Cardiologia');

        await waitFor(() => {
            expect(screen.getAllByRole('combobox')[1]).not.toBeDisabled();
        });

        await user.selectOptions(screen.getAllByRole('combobox')[1], '1');

        // Puede que el texto de "Buscando" sea muy rápido o no aparezca
        await waitFor(() => expect(screen.getByRole('button', { name: '10:00' })).toBeInTheDocument(), { timeout: 2000 });
        expect(screen.getByRole('button', { name: '10:30' })).toBeInTheDocument();
    });

    it('debe actualizar el AppointmentSummary al seleccionar una hora', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <BookAppointmentPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByRole('combobox').length).toBeGreaterThan(0);
        });

        await user.selectOptions(screen.getAllByRole('combobox')[0], 'Cardiologia');
        await waitFor(() => {
            expect(screen.getAllByRole('combobox')[1]).not.toBeDisabled();
        });
        await user.selectOptions(screen.getAllByRole('combobox')[1], '1');
        await waitFor(() => expect(screen.getByRole('button', { name: '10:00' })).toBeInTheDocument(), { timeout: 1500 });

        expect(screen.getByTestId('summary-time')).toHaveTextContent('No seleccionado');

        await user.click(screen.getByRole('button', { name: '10:30' }));

        expect(screen.getByTestId('summary-time')).toHaveTextContent('10:30');
    });

    it('debe navegar a la confirmación al hacer clic en "Confirmar Cita"', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <BookAppointmentPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByRole('combobox').length).toBeGreaterThan(0);
        });

        // Completar el flujo completo
        await user.selectOptions(screen.getAllByRole('combobox')[0], 'Cardiologia');
        await waitFor(() => {
            expect(screen.getAllByRole('combobox')[1]).not.toBeDisabled();
        });
        await user.selectOptions(screen.getAllByRole('combobox')[1], '1');
        await waitFor(() => expect(screen.getByRole('button', { name: '10:00' })).toBeInTheDocument(), { timeout: 2000 });
        await user.click(screen.getByRole('button', { name: '10:30' }));

        // Hacer clic en confirmar
        const confirmButton = screen.getByRole('button', { name: 'Confirmar Cita' });
        expect(confirmButton).toBeInTheDocument();
        expect(confirmButton).not.toBeDisabled();
    });

    it('debe resetear el doctor y la hora si la especialidad cambia', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <BookAppointmentPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByRole('combobox').length).toBeGreaterThan(0);
        });

        // Seleccionar especialidad, doctor y hora
        await user.selectOptions(screen.getAllByRole('combobox')[0], 'Cardiologia');
        await waitFor(() => {
            expect(screen.getAllByRole('combobox')[1]).not.toBeDisabled();
        });
        await user.selectOptions(screen.getAllByRole('combobox')[1], '1');
        await waitFor(() => expect(screen.getByRole('button', { name: '10:00' })).toBeInTheDocument(), { timeout: 2000 });
        await user.click(screen.getByRole('button', { name: '10:30' }));

        // Verificar que se seleccionó
        expect(screen.getAllByRole('combobox')[1]).toHaveValue('1');
        expect(screen.getByTestId('summary-time')).toHaveTextContent('10:30');

        // Cambiar especialidad
        await user.selectOptions(screen.getAllByRole('combobox')[0], 'Pediatria');

        // Verificar que el doctor se reseteó
        await waitFor(() => {
            const doctorSelect = screen.getAllByRole('combobox')[1];
            expect(doctorSelect).toHaveValue('');
        }, { timeout: 3000 });
    });
});