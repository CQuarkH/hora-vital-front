import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AppointmentDetailPage from '../../../src/pages/patient/AppointmentDetailPage';
import type { AppointmentStatus } from '../../../src/components/appointments/AppointmentStatusBadge';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ id: 'APT-2024-001' }),
    };
});

vi.mock('../../../src/components/appointments/AppointmentStatusBadge', () => ({
    AppointmentStatusBadge: ({ status }: { status: AppointmentStatus }) => (
        <span data-testid="status-badge">{status}</span>
    )
}));

vi.mock('../../../src/components/appointments/CancelAppointmentModal', () => ({
    CancelAppointmentModal: ({ onConfirm, onClose }: {
        onConfirm: (reason: string) => void,
        onClose: () => void
    }) => (
        <div data-testid="cancel-modal">
            <button onClick={() => onConfirm('Razón de prueba')}>Confirmar Cancelación</button>
            <button onClick={onClose}>Cerrar Modal</button>
        </div>
    )
}));

vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn()
    }
}));

vi.mock('../../../src/services/appointments/appointment_service', () => ({
    appointmentService: {
        getMyAppointments: vi.fn().mockResolvedValue([{
            id: 'APT-2024-001',
            appointmentDate: '2024-01-14',
            startTime: '10:30',
            endTime: '11:00',
            status: 'SCHEDULED',
            notes: 'Control de rutina. Traer exámenes de sangre si los tiene.',
            doctorProfile: {
                id: '1',
                user: {
                    id: '1',
                    firstName: 'María',
                    lastName: 'Rodríguez'
                },
                specialty: {
                    id: '1',
                    name: 'Medicina General'
                }
            },
            specialty: {
                id: '1',
                name: 'Medicina General'
            },
            patient: {
                id: '1',
                firstName: 'Juan',
                lastName: 'Pérez'
            }
        }]),
        cancelAppointment: vi.fn().mockResolvedValue({}),
        updateAppointment: vi.fn().mockResolvedValue({
            id: 'APT-2024-001',
            appointmentDate: '2024-01-14',
            startTime: '10:30',
            endTime: '11:00',
            status: 'SCHEDULED',
            notes: 'Control de rutina. Traer exámenes de sangre si los tiene.',
            doctorProfile: {
                id: '1',
                user: {
                    id: '1',
                    firstName: 'María',
                    lastName: 'Rodríguez'
                },
                specialty: {
                    id: '1',
                    name: 'Medicina General'
                }
            },
            specialty: {
                id: '1',
                name: 'Medicina General'
            },
            patient: {
                id: '1',
                firstName: 'Juan',
                lastName: 'Pérez'
            }
        })
    }
}));

import toast from 'react-hot-toast';

describe('AppointmentDetailPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe renderizar todos los detalles de la cita mockeada', async () => {
        render(
            <MemoryRouter>
                <AppointmentDetailPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/APT-2024-001/)).toBeInTheDocument();
        });

        expect(screen.getByText('Dr. María Rodríguez')).toBeInTheDocument();
        expect(screen.getByText('Medicina General')).toBeInTheDocument();
        expect(screen.getByTestId('status-badge')).toBeInTheDocument();
        expect(screen.getByText('10:30')).toBeInTheDocument();
        expect(screen.getByText('Control de rutina. Traer exámenes de sangre si los tiene.')).toBeInTheDocument();
    });

    it('debe mostrar el botón "Cancelar Cita" porque el estado es "Confirmada"', async () => {
        render(
            <MemoryRouter>
                <AppointmentDetailPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Cancelar Cita' })).toBeInTheDocument();
        });
    });

    it('debe navegar a /appointments al hacer clic en "Volver a Mis Citas"', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <AppointmentDetailPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Volver a Mis Citas/ })).toBeInTheDocument();
        });

        await user.click(screen.getByRole('button', { name: /Volver a Mis Citas/ }));
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/appointments');
    });

    it('debe navegar a /appointments al hacer clic en "Ver Todas las Citas"', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <AppointmentDetailPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Ver Todas las Citas' })).toBeInTheDocument();
        });

        await user.click(screen.getByRole('button', { name: 'Ver Todas las Citas' }));
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/appointments');
    });

    it('debe navegar a /home al hacer clic en "Ir al Dashboard"', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <AppointmentDetailPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Ir al Dashboard' })).toBeInTheDocument();
        });

        await user.click(screen.getByRole('button', { name: 'Ir al Dashboard' }));
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/home');
    });

    it('debe abrir, confirmar y cerrar el modal de cancelación', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <AppointmentDetailPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Cancelar Cita' })).toBeInTheDocument();
        });

        expect(screen.queryByTestId('cancel-modal')).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Cancelar Cita' }));

        await waitFor(() => {
            expect(screen.getByTestId('cancel-modal')).toBeInTheDocument();
        });

        await user.click(screen.getByRole('button', { name: 'Confirmar Cancelación' }));

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Cita cancelada exitosamente');
            expect(mockNavigate).toHaveBeenCalledWith('/appointments');
        });
    });
});