import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserListRow, type SystemUser } from './UserListRow';

vi.mock('../patients/PatientStatusBadge', () => ({
    PatientStatusBadge: ({ status }: { status: string }) => <span data-testid="status-badge">{status}</span>
}));

const mockUser: SystemUser = {
    id: 'user-456',
    name: 'Carlos Solis',
    email: 'carlos@solis.com',
    role: 'Administrador',
    status: 'Inactivo',
    lastAccess: '10/10/2025'
};

describe('UserListRow', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();
    const user = userEvent.setup();

    beforeEach(() => {
        vi.clearAllMocks();
        render(<UserListRow user={mockUser} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    });

    it('debe renderizar toda la información del usuario', () => {
        expect(screen.getByText('Carlos Solis')).toBeInTheDocument();
        expect(screen.getByText('carlos@solis.com')).toBeInTheDocument();
        expect(screen.getByText('Administrador')).toBeInTheDocument();
        expect(screen.getByText('10/10/2025')).toBeInTheDocument();
    });

    it('debe renderizar el badge de estado correctamente', () => {
        const badge = screen.getByTestId('status-badge');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveTextContent('Inactivo');
    });

    it('debe llamar a onEdit con el usuario al hacer clic en "Editar Usuario"', async () => {
        await user.click(screen.getByTitle('Editar Usuario'));
        expect(mockOnEdit).toHaveBeenCalledTimes(1);
        expect(mockOnEdit).toHaveBeenCalledWith(mockUser);
    });

    it('debe llamar a onDelete con el usuario al hacer clic en "Eliminar Usuario"', async () => {
        await user.click(screen.getByTitle('Eliminar Usuario'));
        expect(mockOnDelete).toHaveBeenCalledTimes(1);
        expect(mockOnDelete).toHaveBeenCalledWith(mockUser);
    });
});