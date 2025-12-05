import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { PatientSelector } from '../../../src/components/secretary/PatientSelector';

vi.mock('../../../src/services/admin/adminService', () => ({
    adminService: {
        getPatients: vi.fn().mockResolvedValue({
            patients: [
                {
                    id: '1',
                    firstName: 'Juan Carlos',
                    lastName: 'González',
                    rut: '12.345.678-9',
                    email: 'juan@email.com',
                    isActive: true
                },
                {
                    id: '2',
                    firstName: 'Ana María',
                    lastName: 'Silva',
                    rut: '11.111.111-1',
                    email: 'ana@email.com',
                    isActive: true
                },
                {
                    id: '3',
                    firstName: 'Pedro Luis',
                    lastName: 'Torres',
                    rut: '22.222.222-2',
                    email: 'pedro@email.com',
                    isActive: true
                }
            ]
        })
    }
}));

describe('PatientSelector Component', () => {
    const mockOnSelectPatient = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders header, search input and register button', async () => {
        render(
            <MemoryRouter>
                <PatientSelector selectedPatient={null} onSelectPatient={mockOnSelectPatient} />
            </MemoryRouter>
        );

        expect(screen.getByText('Seleccionar Paciente')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Buscar por nombre o RUT...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Registrar Nuevo Paciente/i })).toBeInTheDocument();
    });

    it('shows the list of patients and filters by search term', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <PatientSelector selectedPatient={null} onSelectPatient={mockOnSelectPatient} />
            </MemoryRouter>
        );

        expect(await screen.findByRole('button', { name: /Juan Carlos González/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Ana María Silva/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Pedro Luis Torres/ })).toBeInTheDocument();

        await user.type(screen.getByPlaceholderText('Buscar por nombre o RUT...'), 'Ana');

        expect(screen.queryByRole('button', { name: /Juan Carlos González/ })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Ana María Silva/ })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Pedro Luis Torres/ })).not.toBeInTheDocument();
    });

    it('calls onSelectPatient with the chosen patient', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <PatientSelector selectedPatient={null} onSelectPatient={mockOnSelectPatient} />
            </MemoryRouter>
        );

        const target = await screen.findByRole('button', { name: /Juan Carlos González/ });
        await user.click(target);

        expect(mockOnSelectPatient).toHaveBeenCalledTimes(1);
        expect(mockOnSelectPatient.mock.calls[0][0]).toMatchObject({ id: '1' });
    });
});
