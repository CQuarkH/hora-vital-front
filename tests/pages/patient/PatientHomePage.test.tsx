import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PatientHomePage from '../../../src/pages/patient/PatientHomePage';
import AuthContext from '../../../src/context/AuthContext';
import type { User } from '../../../src/types/auth/auth_types';

vi.mock('../../../src/components/dashboard/DashboardCard', () => ({
    DashboardCard: (props: any) => <div data-testid="dashboard-card">{props.title}</div>
}));

vi.mock('../../../src/components/dashboard/AppointmentPreview', () => ({
    AppointmentPreview: () => <div data-testid="appointment-preview">Preview Citas</div>
}));

vi.mock('../../../src/components/dashboard/NotificationPreview', () => ({
    NotificationPreview: () => <div data-testid="notification-preview">Preview Notificaciones</div>
}));

vi.mock('../../../src/services/appointments/appointment_service', () => ({
    appointmentService: {
        getMyAppointments: vi.fn().mockResolvedValue([
            {
                id: '1',
                appointmentDate: '2025-12-10',
                startTime: '10:00',
                endTime: '10:30',
                status: 'SCHEDULED',
                doctorProfile: {
                    user: { firstName: 'Carlos', lastName: 'Mendoza' },
                    specialty: { name: 'Cardiología' }
                },
                specialty: { name: 'Cardiología' }
            },
            {
                id: '2',
                appointmentDate: '2025-12-15',
                startTime: '14:00',
                endTime: '14:30',
                status: 'SCHEDULED',
                doctorProfile: {
                    user: { firstName: 'María', lastName: 'González' },
                    specialty: { name: 'Pediatría' }
                },
                specialty: { name: 'Pediatría' }
            }
        ])
    }
}));

const mockUser: User = { id: '1', firstName: 'Juan', lastName: 'Pérez', email: 'j@p.com', role: 'patient', status: 'active', rut: '11.111.111-1' } as unknown as User;
const mockAuthContextValue = {
    user: mockUser,
} as Partial<any>;

const renderComponent = () => {
    render(
        <MemoryRouter>
            <AuthContext.Provider value={mockAuthContextValue as any}>
                <PatientHomePage />
            </AuthContext.Provider>
        </MemoryRouter>
    );
};

describe('PatientHomePage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe mostrar el mensaje de bienvenida con el nombre del paciente', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(/Bienvenido,?\s*Juan/)).toBeInTheDocument();
        });
    });

    it('debe renderizar los componentes del dashboard', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getAllByTestId('dashboard-card').length).toBeGreaterThan(0);
            expect(screen.getByText('Agendar Cita')).toBeInTheDocument();
            expect(screen.getByText('Mis Citas')).toBeInTheDocument();
        });

        // Esperar a que se carguen las citas
        await waitFor(() => {
            expect(screen.getAllByTestId('appointment-preview').length).toBeGreaterThan(0);
        });
    });
});