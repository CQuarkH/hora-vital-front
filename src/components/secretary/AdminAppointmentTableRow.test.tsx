import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminAppointmentTableRow } from './AdminAppointmentTableRow';
import type { AdminAppointment } from './AdminAppointmentTableRow';

vi.mock('../appointments/AppointmentStatusBadge', () => ({
    AppointmentStatusBadge: ({ status }: { status: string }) => <span data-testid="status-badge">{status}</span>
}));

const mockAppointment: AdminAppointment = {
    id: '1',
    patientName: 'Carlos Ruiz',
    rut: '12.345.678-9',
    doctorName: 'Dra. Ana López',
    date: '10/10/2025',
    time: '10:00 AM',
    status: 'Confirmada',
};

describe('AdminAppointmentTableRow', () => {
    const user = userEvent.setup();
    const mockOnEdit = vi.fn();
    const mockOnCancel = vi.fn();
    const mockOnView = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        render(
            <AdminAppointmentTableRow
                appointment={mockAppointment}
                onEdit={mockOnEdit}
                onCancel={mockOnCancel}
                onView={mockOnView}
            />
        );
    });

    it('debe renderizar la información de la cita', () => {
        expect(screen.getByText('Carlos Ruiz')).toBeInTheDocument();
        expect(screen.getByText('Dra. Ana López')).toBeInTheDocument();
        expect(screen.getByText('10/10/2025')).toBeInTheDocument();
        expect(screen.getByText('10:00 AM')).toBeInTheDocument();
        expect(screen.getByTestId('status-badge')).toHaveTextContent('Confirmada');
    });

    it('debe llamar a onEdit al hacer clic en el botón de editar', async () => {
        await user.click(screen.getByTitle('Editar Cita'));
        expect(mockOnEdit).toHaveBeenCalledTimes(1);
        expect(mockOnEdit).toHaveBeenCalledWith(mockAppointment.id);
    });

    it('debe llamar a onCancel al hacer clic en el botón de cancelar', async () => {
        await user.click(screen.getByTitle('Cancelar Cita'));
        expect(mockOnCancel).toHaveBeenCalledTimes(1);
        expect(mockOnCancel).toHaveBeenCalledWith(mockAppointment.id);
    });

    it('debe llamar a onView al hacer clic en el botón de ver detalle', async () => {
        await user.click(screen.getByTitle('Ver Detalle'));
        expect(mockOnView).toHaveBeenCalledTimes(1);
        expect(mockOnView).toHaveBeenCalledWith(mockAppointment.id);
    });
});