import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppointmentListCard, type Appointment } from './AppointmentListCard';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('./AppointmentStatusBadge', () => ({
    AppointmentStatusBadge: ({ status }: { status: string }) => <span data-testid="status-badge">{status}</span>
}));

const mockAppointment: Appointment = {
    id: 'apt-123',
    doctorName: 'Dr. Evelyn Reed',
    specialty: 'Cardiología',
    date: '25-10-2025', 
    time: '09:00 AM',
    location: 'Piso 2, Sala 3',
    status: 'Confirmada',
};

describe('AppointmentListCard Component', () => {
    const user = userEvent.setup();

    beforeEach(() => {
        vi.clearAllMocks();
        render(
            <MemoryRouter>
                <AppointmentListCard {...mockAppointment} />
            </MemoryRouter>
        );
    });

    it('debe renderizar la información de la cita correctamente', () => {
        expect(screen.getByText('25')).toBeInTheDocument();
        expect(screen.getByText('oct')).toBeInTheDocument();
        expect(screen.getByText('Dr. Evelyn Reed')).toBeInTheDocument();
        expect(screen.getByText('Cardiología')).toBeInTheDocument();
        expect(screen.getByTestId('status-badge')).toHaveTextContent('Confirmada');
        expect(screen.getByText('25-10-2025')).toBeInTheDocument();
        expect(screen.getByText('09:00 AM')).toBeInTheDocument();
        expect(screen.getByText('Piso 2, Sala 3')).toBeInTheDocument();
    });

    it('debe navegar a la página de detalles al hacer clic en "Ver Detalles"', async () => {
        const detailsButton = screen.getByRole('button', { name: 'Ver Detalles' });
        await user.click(detailsButton);

        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/appointments/apt-123');
    });

    it('debe mostrar "???" si el mes en la fecha es inválido', () => {
        const badDateAppt = { ...mockAppointment, date: '25-13-2025' };
        
        render(
            <MemoryRouter>
                <AppointmentListCard {...badDateAppt} />
            </MemoryRouter>
        );

        const days = screen.getAllByText('25');
        expect(days.length).toBeGreaterThanOrEqual(2);
        expect(screen.getByText('???')).toBeInTheDocument();
    });
});