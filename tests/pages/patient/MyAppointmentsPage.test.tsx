import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import MyAppointmentsPage from '../../../src/pages/patient/MyAppointmentsPage';
import type { Appointment } from '../../../src/components/appointments/AppointmentListCard';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('../../../src/components/appointments/AppointmentListCard', () => ({
    AppointmentListCard: (props: Appointment) => (
        <div data-testid="appointment-card">
            {props.doctorName}, {props.specialty}, {props.status}
        </div>
    )
}));

vi.mock('../../../src/services/appointments/appointment_service', () => ({
    appointmentService: {
        getMyAppointments: vi.fn().mockResolvedValue([
            {
                id: '1',
                appointmentDate: '2024-01-21',
                startTime: '10:00',
                endTime: '10:30',
                doctorProfile: {
                    id: '1',
                    user: { id: '1', firstName: 'Carlos', lastName: 'Mendoza' },
                    specialty: { id: '1', name: 'Cardiología' }
                },
                specialty: { id: '1', name: 'Cardiología' },
                status: 'SCHEDULED'
            },
            {
                id: '2',
                appointmentDate: '2024-01-14',
                startTime: '14:00',
                endTime: '14:30',
                doctorProfile: {
                    id: '2',
                    user: { id: '2', firstName: 'María', lastName: 'Rodríguez' },
                    specialty: { id: '2', name: 'Pediatría' }
                },
                specialty: { id: '2', name: 'Pediatría' },
                status: 'SCHEDULED'
            },
            {
                id: '3',
                appointmentDate: '2023-12-09',
                startTime: '09:00',
                endTime: '09:30',
                doctorProfile: {
                    id: '3',
                    user: { id: '3', firstName: 'Ana', lastName: 'Silva' },
                    specialty: { id: '3', name: 'Medicina General' }
                },
                specialty: { id: '3', name: 'Medicina General' },
                status: 'COMPLETED'
            },
            {
                id: '4',
                appointmentDate: '2023-11-15',
                startTime: '11:00',
                endTime: '11:30',
                doctorProfile: {
                    id: '4',
                    user: { id: '4', firstName: 'Luis', lastName: 'Torres' },
                    specialty: { id: '4', name: 'Traumatología' }
                },
                specialty: { id: '4', name: 'Traumatología' },
                status: 'COMPLETED'
            },
            {
                id: '5',
                appointmentDate: '2023-10-10',
                startTime: '15:00',
                endTime: '15:30',
                doctorProfile: {
                    id: '5',
                    user: { id: '5', firstName: 'Patricia', lastName: 'Gómez' },
                    specialty: { id: '5', name: 'Dermatología' }
                },
                specialty: { id: '5', name: 'Dermatología' },
                status: 'CANCELLED'
            }
        ])
    }
}));

describe('MyAppointmentsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe renderizar el título, filtros y el botón "Nueva Cita"', async () => {
        render(
            <MemoryRouter>
                <MyAppointmentsPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Mis Citas Médicas')).toBeInTheDocument();
        });

        expect(screen.getByPlaceholderText('Buscar por médico o especialidad...')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toHaveValue('Todos');
        expect(screen.getByRole('button', { name: /Nueva Cita/ })).toBeInTheDocument();
    });

    it('debe mostrar las 5 citas mockeadas por defecto, ordenadas por fecha', async () => {
        render(
            <MemoryRouter>
                <MyAppointmentsPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            const cards = screen.getAllByTestId('appointment-card');
            expect(cards).toHaveLength(5);
            expect(cards[0]).toHaveTextContent('Dr. Carlos Mendoza');
            expect(cards[1]).toHaveTextContent('Dr. María Rodríguez');
            expect(cards[2]).toHaveTextContent('Dr. Ana Silva');
        });
    });

    it('debe navegar a /book-appointment al hacer clic en "Nueva Cita"', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <MyAppointmentsPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Nueva Cita/ })).toBeInTheDocument();
        });

        await user.click(screen.getByRole('button', { name: /Nueva Cita/ }));
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/book-appointment');
    });

    it('debe filtrar por especialidad al escribir en la búsqueda', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <MyAppointmentsPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByTestId('appointment-card').length).toBeGreaterThan(0);
        });

        const searchInput = screen.getByPlaceholderText('Buscar por médico o especialidad...');
        await user.type(searchInput, 'Cardiología');

        await waitFor(() => {
            const cards = screen.getAllByTestId('appointment-card');
            expect(cards).toHaveLength(1);
            expect(cards[0]).toHaveTextContent('Dr. Carlos Mendoza');
        });
    });

    it('debe filtrar por estado al cambiar el select', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <MyAppointmentsPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByTestId('appointment-card').length).toBeGreaterThan(0);
        });

        const statusSelect = screen.getByRole('combobox');
        await user.selectOptions(statusSelect, 'Completada');

        await waitFor(() => {
            const cards = screen.getAllByTestId('appointment-card');
            expect(cards).toHaveLength(2);
            expect(cards[0]).toHaveTextContent('Dr. Ana Silva');
            expect(cards[1]).toHaveTextContent('Dr. Luis Torres');
        });
    });

    it('debe filtrar por estado y médico simultáneamente', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <MyAppointmentsPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByTestId('appointment-card').length).toBeGreaterThan(0);
        });

        const statusSelect = screen.getByRole('combobox');
        await user.selectOptions(statusSelect, 'Completada');

        const searchInput = screen.getByPlaceholderText('Buscar por médico o especialidad...');
        await user.type(searchInput, 'Luis');

        await waitFor(() => {
            const cards = screen.getAllByTestId('appointment-card');
            expect(cards).toHaveLength(1);
            expect(cards[0]).toHaveTextContent('Dr. Luis Torres');
        });
    });

    it('debe mostrar un mensaje si no se encuentran resultados', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <MyAppointmentsPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByTestId('appointment-card').length).toBeGreaterThan(0);
        });

        const searchInput = screen.getByPlaceholderText('Buscar por médico o especialidad...');
        await user.type(searchInput, 'NoExisto');

        await waitFor(() => {
            expect(screen.queryByTestId('appointment-card')).not.toBeInTheDocument();
            expect(screen.getByText('No se encontraron citas que coincidan con tu búsqueda.')).toBeInTheDocument();
        });
    });
});