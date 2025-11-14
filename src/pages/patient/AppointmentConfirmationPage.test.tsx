import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppointmentConfirmationPage from './AppointmentConfirmationPage';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('AppointmentConfirmationPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        render(
            <MemoryRouter>
                <AppointmentConfirmationPage />
            </MemoryRouter>
        );
    });

    it('debe renderizar el mensaje de confirmación', () => {
        expect(screen.getByText('¡Cita agendada!')).toBeInTheDocument();
        expect(screen.getByText(/Tu cita se ha registrado correctamente/)).toBeInTheDocument();
    });

    it('debe navegar a "/appointments" al hacer clic en "Ir a Mis Citas"', async () => {
        const user = userEvent.setup();
        const button = screen.getByRole('button', { name: 'Ir a Mis Citas' });
        await user.click(button);
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/appointments');
    });

    it('debe navegar a "/" al hacer clic en "Volver al inicio"', async () => {
        const user = userEvent.setup();
        const button = screen.getByRole('button', { name: 'Volver al inicio' });
        await user.click(button);
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});