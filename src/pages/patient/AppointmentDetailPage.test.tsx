import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AppointmentDetailPage from './AppointmentDetailPage';
import type { AppointmentStatus } from '../../components/appointments/AppointmentStatusBadge';

const MOCK_APPOINTMENT_DETAIL = {
    id: 'APT-2024-001',
    doctorName: 'Dr. María Rodríguez',
    specialty: 'Medicina General',
    status: 'Confirmada' as AppointmentStatus,
    date: 'domingo, 14 de enero de 2024',
    time: '10:30',
    location: 'CESFAM San Juan',
    address: 'Av Libertador 1234, Santiago',
    phone: '+56 2 2345 6789',
    notes: 'Control de rutina. Traer exámenes de sangre si los tiene.'
};

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ id: 'APT-2024-001' }),
    };
});
vi.mock('../../components/appointments/AppointmentStatusBadge', () => ({
    AppointmentStatusBadge: ({ status }: { status: AppointmentStatus }) => (
        <span data-testid="status-badge">{status}</span>
    )
}));
vi.mock('../../components/appointments/CancelAppointmentModal', () => ({
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

global.alert = vi.fn();

describe('AppointmentDetailPage', () => {
    const user = userEvent.setup();

    beforeEach(() => {
        vi.clearAllMocks();
        (global.alert as any).mockClear();
        render(
            <MemoryRouter>
                <AppointmentDetailPage />
            </MemoryRouter>
        );
    });

    it('debe renderizar todos los detalles de la cita mockeada', () => {
        const data = MOCK_APPOINTMENT_DETAIL;

        expect(screen.getByText(/APT-2024-001/)).toBeInTheDocument();
        expect(screen.getByText(data.doctorName)).toBeInTheDocument();
        expect(screen.getByText(data.specialty)).toBeInTheDocument();
        expect(screen.getByTestId('status-badge')).toHaveTextContent(data.status);
        expect(screen.getByText(data.date)).toBeInTheDocument();
        expect(screen.getByText(data.time)).toBeInTheDocument();
        expect(screen.getByText(data.location)).toBeInTheDocument();
        expect(screen.getByText(data.address)).toBeInTheDocument();
        expect(screen.getByText(data.phone)).toBeInTheDocument();
        expect(screen.getByText(data.notes)).toBeInTheDocument();
    });

    it('debe mostrar el botón "Cancelar Cita" porque el estado es "Confirmada"', () => {
        expect(screen.getByRole('button', { name: 'Cancelar Cita' })).toBeInTheDocument();
    });

    it('debe navegar a /appointments al hacer clic en "Volver a Mis Citas"', async () => {
        await user.click(screen.getByRole('button', { name: /Volver a Mis Citas/ }));
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/appointments');
    });

    it('debe navegar a /appointments al hacer clic en "Ver Todas las Citas"', async () => {
        await user.click(screen.getByRole('button', { name: 'Ver Todas las Citas' }));
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/appointments');
    });

    it('debe navegar a /home al hacer clic en "Ir al Dashboard"', async () => {
        await user.click(screen.getByRole('button', { name: 'Ir al Dashboard' }));
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/home');
    });

    it('debe abrir, confirmar y cerrar el modal de cancelación', async () => {
        expect(screen.queryByTestId('cancel-modal')).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Cancelar Cita' }));
        expect(screen.getByTestId('cancel-modal')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Confirmar Cancelación' }));

        expect(screen.queryByTestId('cancel-modal')).not.toBeInTheDocument();
        expect(global.alert).toHaveBeenCalledTimes(1);
        expect(global.alert).toHaveBeenCalledWith(
            'Cita APT-2024-001 cancelada. Razón: Razón de prueba'
        );

        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/appointments');
    });
});