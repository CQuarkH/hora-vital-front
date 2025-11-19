import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('../../../src/components/appointments/AppointmentStatusBadge', () => ({
    AppointmentStatusBadge: ({ status }: { status: string }) => <span data-testid="status-badge">{status}</span>
}));

import { TodayAppointmentRow } from '../../../src/components/secretary/TodayAppointmentRow';
import type { TodayAppointment } from '../../../src/components/secretary/TodayAppointmentRow';

const mockAppointment: TodayAppointment = {
    id: '1',
    time: '09:30 AM',
    patientName: 'Elena Soto',
    appointmentType: 'Control',
    rut: '15.555.555-5',
    doctorInfo: 'Dr. Marco Polo',
    status: 'Confirmada',
};

describe('TodayAppointmentRow', () => {
    const user = userEvent.setup();

    beforeEach(() => {
        vi.clearAllMocks();
        render(<TodayAppointmentRow appointment={mockAppointment} />);
    });

    it('debe renderizar la información de la cita', () => {
        expect(screen.getByText('09:30 AM')).toBeInTheDocument();
        expect(screen.getByText('Elena Soto')).toBeInTheDocument();
        expect(screen.getByText(/15\.555\.555-5/)).toBeInTheDocument();
        expect(screen.getByTestId('status-badge')).toHaveTextContent('Confirmada');
    });

    it('should render action buttons and allow clicking them', async () => {
        const reprogramBtn = screen.getByTitle('Reprogramar Cita');
        const editBtn = screen.getByTitle('Editar / Ver Ficha');

        expect(reprogramBtn).toBeInTheDocument();
        expect(editBtn).toBeInTheDocument();

        await user.click(reprogramBtn);
        await user.click(editBtn);
    });
});