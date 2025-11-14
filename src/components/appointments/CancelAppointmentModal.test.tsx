import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CancelAppointmentModal } from './CancelAppointmentModal';
import userEvent from '@testing-library/user-event';

describe('CancelAppointmentModal Component', () => {
    const mockOnClose = vi.fn();
    const mockOnConfirm = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        render(
            <CancelAppointmentModal
                appointmentId="APT-123"
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
            />
        );
    });

    it('debe renderizar el título y el ID de la cita', () => {
        expect(screen.getByText('Cancelar cita')).toBeInTheDocument();
        expect(screen.getByText(/Estás a punto de cancelar la cita/)).toBeInTheDocument();
        expect(screen.getByText('APT-123')).toBeInTheDocument();
    });

    it('debe llamar a onClose cuando se hace clic en "Volver"', () => {
        const closeButton = screen.getByRole('button', { name: 'Volver' });
        fireEvent.click(closeButton);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('debe llamar a onConfirm con el motivo al hacer clic en "Confirmar cancelación"', async () => {
        const user = userEvent.setup();
        const textarea = screen.getByPlaceholderText('Motivo de la cancelación');
        const confirmButton = screen.getByRole('button', { name: 'Confirmar cancelación' });

        await user.type(textarea, 'Motivo de prueba');
        await user.click(confirmButton);

        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
        expect(mockOnConfirm).toHaveBeenCalledWith('Motivo de prueba');
    });

    it('debe llamar a onConfirm con un string vacío si no se escribe motivo', () => {
        const confirmButton = screen.getByRole('button', { name: 'Confirmar cancelación' });
        
        fireEvent.click(confirmButton);

        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
        expect(mockOnConfirm).toHaveBeenCalledWith('');
    });
});