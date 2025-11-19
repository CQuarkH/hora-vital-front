import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StepSelector } from '../../../src/components/appointments/StepSelector';
import { HiOutlineCalendar } from 'react-icons/hi';

describe('StepSelector', () => {
    it('debe renderizar el icono, título, descripción y children', () => {
        render(
            <StepSelector
                icon={<HiOutlineCalendar data-testid="step-icon" />}
                title="Paso 1"
                description="Selecciona una fecha"
            >
                <div>Contenido del hijo</div>
            </StepSelector>
        );

        expect(screen.getByTestId('step-icon')).toBeInTheDocument();
        expect(screen.getByText('Paso 1')).toBeInTheDocument();
        expect(screen.getByText('Selecciona una fecha')).toBeInTheDocument();
        expect(screen.getByText('Contenido del hijo')).toBeInTheDocument();
    });
});