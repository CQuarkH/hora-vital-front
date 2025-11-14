import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PatientHomePage from './PatientHomePage';
import AuthContext from '../../context/AuthContext';
import type { User } from '../../types/auth/auth_types';

vi.mock('../../components/dashboard/DashboardCard', () => ({
    DashboardCard: (props: any) => <div data-testid="dashboard-card">{props.title}</div>
}));

vi.mock('../../components/dashboard/AppointmentPreview', () => ({
    AppointmentPreview: () => <div data-testid="appointment-preview">Preview Citas</div>
}));

vi.mock('../../components/dashboard/NotificationPreview', () => ({
    NotificationPreview: () => <div data-testid="notification-preview">Preview Notificaciones</div>
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

    it('debe mostrar el mensaje de bienvenida con el nombre del paciente', () => {
        renderComponent();
        expect(screen.getByText(/Bienvenido,?\s*Juan/)).toBeInTheDocument();
    });

    it('debe renderizar los componentes del dashboard', () => {
        renderComponent();
        
        expect(screen.getAllByTestId('appointment-preview').length).toBeGreaterThan(0);
        expect(screen.getAllByTestId('notification-preview').length).toBeGreaterThan(0);
        expect(screen.getAllByTestId('dashboard-card').length).toBeGreaterThan(0);
        expect(screen.getByText('Agendar Cita')).toBeInTheDocument();
        expect(screen.getByText('Mis Citas')).toBeInTheDocument();
    });
});