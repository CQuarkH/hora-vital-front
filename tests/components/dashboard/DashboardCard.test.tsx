import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DashboardCard } from '../../../src/components/dashboard/DashboardCard';
import { MemoryRouter } from 'react-router-dom';
import { HiOutlineCalendar } from 'react-icons/hi';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('DashboardCard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        render(
            <MemoryRouter>
                <DashboardCard
                    title="Agendar Cita"
                    description="Reserva tu próxima hora"
                    icon={<HiOutlineCalendar data-testid="card-icon" />}
                    to="/book-appointment"
                />
            </MemoryRouter>
        );
    });

    it('debe renderizar el título, descripción y el icono', () => {
        expect(screen.getByText('Agendar Cita')).toBeInTheDocument();
        expect(screen.getByText('Reserva tu próxima hora')).toBeInTheDocument();
        expect(screen.getByTestId('card-icon')).toBeInTheDocument();
    });

    it('debe navegar a la ruta "to" al hacer clic', async () => {
        const user = userEvent.setup();
        await user.click(screen.getByRole('button'));
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/book-appointment');
    });
});