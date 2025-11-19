import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PatientStatusBadge } from '../../../src/components/patients/PatientStatusBadge';

describe('PatientStatusBadge Component', () => {
    it('debe renderizar el estado "Activo" con estilos de "green"', () => {
        render(<PatientStatusBadge status="Activo" />);
        
        const badge = screen.getByText('Activo');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('bg-green-100', 'text-green-800');
    });

    it('debe renderizar el estado "Inactivo" con estilos de "yellow"', () => {
        render(<PatientStatusBadge status="Inactivo" />);
        
        const badge = screen.getByText('Inactivo');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800');
    });

    it('debe tener las clases base del badge', () => {
        render(<PatientStatusBadge status="Activo" />);
        
        const badge = screen.getByText('Activo');
        expect(badge).toHaveClass('text-xs', 'font-semibold', 'px-2.5', 'py-0.5', 'rounded-full');
    });
});