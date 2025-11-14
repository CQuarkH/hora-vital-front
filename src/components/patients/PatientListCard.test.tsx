import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PatientListCard, type PatientData } from './PatientListCard';
import { vi } from 'vitest';

vi.mock('./PatientStatusBadge', () => ({
    PatientStatusBadge: ({ status }: { status: string }) => <span data-testid="status-badge">{status}</span>
}));

const mockPatient: PatientData = {
    id: 'p1',
    name: 'Ana García',
    rut: '11.111.111-1',
    phone: '+56912345678',
    email: 'ana@email.com',
    age: 34,
    lastVisit: '10/05/2024',
    nextVisit: 'N/A',
    totalAppointments: 8,
    status: 'Activo',
};

describe('PatientListCard Component', () => {
    beforeEach(() => {
        render(<PatientListCard patient={mockPatient} />);
    });

    it('debe renderizar las iniciales del paciente (AG)', () => {
        expect(screen.getByText('AG')).toBeInTheDocument();
    });

    it('debe renderizar el nombre y el estado', () => {
        expect(screen.getByText('Ana García')).toBeInTheDocument();
        const badge = screen.getByTestId('status-badge');
        expect(badge).toHaveTextContent('Activo');
    });

    it('debe renderizar la información demográfica (edad, RUT, email, teléfono)', () => {
        expect(screen.getByText('34 años')).toBeInTheDocument();
        expect(screen.getByText('11.111.111-1')).toBeInTheDocument();
        expect(screen.getByText('ana@email.com')).toBeInTheDocument();
        expect(screen.getByText('+56912345678')).toBeInTheDocument();
    });

    it('debe renderizar la información de visitas', () => {
        expect(screen.getByText('10/05/2024')).toBeInTheDocument();
        expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('debe renderizar el total de citas', () => {
        expect(screen.getByText('8')).toBeInTheDocument();
        expect(screen.getByText('Citas totales')).toBeInTheDocument();
    });

    it('debe renderizar los 4 botones de acción', () => {
        expect(screen.getByTitle('Agendar Cita')).toBeInTheDocument();
        expect(screen.getByTitle('Ver Historial')).toBeInTheDocument();
        expect(screen.getByTitle('Editar Paciente')).toBeInTheDocument();
        expect(screen.getByTitle('Ver Ficha')).toBeInTheDocument();
    });
});