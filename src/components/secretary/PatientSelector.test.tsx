import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PatientSelector } from './PatientSelector';

describe('PatientSelector Component', () => {
    const mockOnSelectPatient = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders header, search input and register button', () => {
        render(<PatientSelector selectedPatient={null} onSelectPatient={mockOnSelectPatient} />);

        expect(screen.getByText('Seleccionar Paciente')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Buscar por nombre o RUT...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Registrar Nuevo Paciente/i })).toBeInTheDocument();
    });

    it('shows the list of patients and filters by search term', async () => {
        const user = userEvent.setup();
        render(<PatientSelector selectedPatient={null} onSelectPatient={mockOnSelectPatient} />);

        expect(screen.getByRole('button', { name: /Juan Carlos González/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Ana María Silva/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Pedro Luis Torres/ })).toBeInTheDocument();

        await user.type(screen.getByPlaceholderText('Buscar por nombre o RUT...'), 'Ana');

        expect(screen.queryByRole('button', { name: /Juan Carlos González/ })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Ana María Silva/ })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Pedro Luis Torres/ })).not.toBeInTheDocument();
    });

    it('calls onSelectPatient with the chosen patient', async () => {
        const user = userEvent.setup();
        render(<PatientSelector selectedPatient={null} onSelectPatient={mockOnSelectPatient} />);

        const target = screen.getByRole('button', { name: /Juan Carlos González/ });
        await user.click(target);

        expect(mockOnSelectPatient).toHaveBeenCalledTimes(1);
        expect(mockOnSelectPatient.mock.calls[0][0]).toMatchObject({ id: '1', name: 'Juan Carlos González' });
    });
});
