import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppointmentSummary from '../../../src/components/appointments/AppointmentSummary';

describe('AppointmentSummary', () => {
    const mockOnConfirm = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe renderizar los textos por defecto cuando las props son nulas', () => {
        render(<AppointmentSummary onConfirm={mockOnConfirm} />);
        
        expect(screen.getAllByText('No seleccionada')).toHaveLength(3); 
        
        expect(screen.getByText('No seleccionado')).toBeInTheDocument(); 
    });

    it('debe renderizar los detalles de la cita cuando se proveen', () => {
        render(
            <AppointmentSummary
                specialty="Cardiología"
                doctor="Dr. House"
                date="10/10/2025"
                time="10:00 AM"
                onConfirm={mockOnConfirm}
            />
        );
        expect(screen.getByText('Cardiología')).toBeInTheDocument();
        expect(screen.getByText('Dr. House')).toBeInTheDocument();
        expect(screen.getByText('10/10/2025')).toBeInTheDocument();
        expect(screen.getByText('10:00 AM')).toBeInTheDocument();
    });

    it('el botón "Confirmar Cita" debe estar deshabilitado si falta información', () => {
        render(<AppointmentSummary onConfirm={mockOnConfirm} />);
        const button = screen.getByRole('button', { name: 'Confirmar Cita' });
        expect(button).toBeDisabled();
    });

    it('el botón debe estar habilitado si toda la información está completa', () => {
        render(
            <AppointmentSummary
                specialty="Cardiología"
                doctor="Dr. House"
                date="10/10/2025"
                time="10:00 AM"
                onConfirm={mockOnConfirm}
            />
        );
        const button = screen.getByRole('button', { name: 'Confirmar Cita' });
        expect(button).not.toBeDisabled();
    });

    it('debe llamar a onConfirm cuando se hace clic y el botón está habilitado', async () => {
        const user = userEvent.setup();
        render(
            <AppointmentSummary
                specialty="Cardiología"
                doctor="Dr. House"
                date="10/10/2025"
                time="10:00 AM"
                onConfirm={mockOnConfirm}
            />
        );
        const button = screen.getByRole('button', { name: 'Confirmar Cita' });
        await user.click(button);
        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it('no debe llamar a onConfirm si el botón está deshabilitado', async () => {
        const user = userEvent.setup();
        render(<AppointmentSummary onConfirm={mockOnConfirm} />);
        const button = screen.getByRole('button', { name: 'Confirmar Cita' });
        
        await user.click(button);
        expect(mockOnConfirm).not.toHaveBeenCalled();
    });
});