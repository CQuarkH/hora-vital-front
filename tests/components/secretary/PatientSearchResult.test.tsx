import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PatientSearchResult } from '../../../src/components/secretary/PatientSearchResult';

const mockPatient = {
    id: 'p-1',
    name: 'Roberto Gómez',
    rut: '10.100.100-K',
    phone: '9 1234 5678',
};

describe('PatientSearchResult', () => {
    const user = userEvent.setup();
    const mockOnSelect = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        render(<PatientSearchResult patient={mockPatient} isSelected={false} onSelect={mockOnSelect} />);
    });

    it('debe renderizar la información del paciente', () => {
        expect(screen.getByText('Roberto Gómez')).toBeInTheDocument();
        expect(screen.getByText(/10\.100\.100-K/)).toBeInTheDocument();
        expect(screen.getByText('9 1234 5678')).toBeInTheDocument();
    });

    it('calls onSelect with the patient when the result is clicked', async () => {
        const button = screen.getByRole('button');
        await user.click(button);
        expect(mockOnSelect).toHaveBeenCalledTimes(1);
        expect(mockOnSelect).toHaveBeenCalledWith(mockPatient);
    });
});