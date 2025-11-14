import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SummaryStatCard } from './SummaryStatCard';

describe('SummaryStatCard Component', () => {
    it('debe renderizar el valor y la etiqueta correctamente', () => {
        render(<SummaryStatCard value="150" label="Pacientes Activos" />);
        
        expect(screen.getByText('150')).toBeInTheDocument();
        expect(screen.getByText('Pacientes Activos')).toBeInTheDocument();
    });

    it('debe aplicar estilos correctos al valor y la etiqueta', () => {
        render(<SummaryStatCard value="150" label="Pacientes Activos" />);

        const valueEl = screen.getByText('150');
        expect(valueEl).toHaveClass('text-4xl', 'font-bold', 'text-medical-700');

        const labelEl = screen.getByText('Pacientes Activos');
        expect(labelEl).toHaveClass('text-sm', 'font-medium', 'text-gray-600');
    });

    it('debe funcionar con valores numéricos', () => {
        render(<SummaryStatCard value={10} label="Total Citas" />);
        
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('Total Citas')).toBeInTheDocument();
    });
});