import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppointmentPreview } from '../../../src/components/dashboard/AppointmentPreview';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('AppointmentPreview', () => {
    const defaultProps = {
        id: '1',
        doctorName: 'Dr. House',
        specialty: 'Diagnóstico',
        date: { day: '01', month: 'ENE' },
        time: '10:00',
        status: 'Confirmada' as const
    };

    it('debe renderizar la información correctamente', () => {
        render(
            <MemoryRouter>
                <AppointmentPreview {...defaultProps} />
            </MemoryRouter>
        );

        expect(screen.getByText('Dr. House')).toBeInTheDocument();
        expect(screen.getByText('Diagnóstico')).toBeInTheDocument();
        expect(screen.getByText('01')).toBeInTheDocument();
        expect(screen.getByText('ENE')).toBeInTheDocument();
        expect(screen.getByText('10:00')).toBeInTheDocument();
        expect(screen.getByText('Confirmada')).toBeInTheDocument();
    });

    it('debe aplicar estilos correctos para estado Confirmada', () => {
        render(
            <MemoryRouter>
                <AppointmentPreview {...defaultProps} status="Confirmada" />
            </MemoryRouter>
        );

        const statusBadge = screen.getByText('Confirmada');
        expect(statusBadge).toHaveClass('bg-green-100');
    });

    it('debe aplicar estilos correctos para estado Pendiente', () => {
        render(
            <MemoryRouter>
                <AppointmentPreview {...defaultProps} status="Pendiente" />
            </MemoryRouter>
        );

        const statusBadge = screen.getByText('Pendiente');
        expect(statusBadge).toHaveClass('bg-yellow-100');
    });

    it('debe navegar al detalle al hacer clic en Ver Detalles', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <AppointmentPreview {...defaultProps} />
            </MemoryRouter>
        );

        await user.click(screen.getByText('Ver Detalles'));
        expect(mockNavigate).toHaveBeenCalledWith('/appointments/1');
    });
});
