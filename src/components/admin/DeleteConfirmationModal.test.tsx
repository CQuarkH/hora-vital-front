import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import type { SystemUser } from './UserListRow';

const mockUser: SystemUser = {
    id: 'user-123',
    name: 'Juan Pérez',
    email: 'juan@perez.com',
    role: 'Paciente',
    status: 'Activo',
    lastAccess: 'Ayer'
};

describe('DeleteConfirmationModal', () => {
    const mockOnClose = vi.fn();
    const mockOnConfirm = vi.fn();
    const user = userEvent.setup();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('no debe renderizar nada si la prop "user" es null', () => {
        const { container } = render(<DeleteConfirmationModal user={null} onClose={mockOnClose} onConfirm={mockOnConfirm} />);
        
        expect(container.firstChild).toBeNull();
        expect(screen.queryByText('Confirmar Eliminación')).not.toBeInTheDocument();
    });

    it('debe renderizar el modal con el nombre y email del usuario', () => {
        render(<DeleteConfirmationModal user={mockUser} onClose={mockOnClose} onConfirm={mockOnConfirm} />);

        expect(screen.getByText('Confirmar Eliminación')).toBeInTheDocument();
        expect(screen.getByText(mockUser.name)).toBeInTheDocument();
        expect(screen.getByText(new RegExp(mockUser.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))).toBeInTheDocument();
        expect(screen.getByText(/Esta acción es irreversible/)).toBeInTheDocument();
    });

    it('debe llamar a onClose cuando se hace clic en "Cancelar"', async () => {
        render(<DeleteConfirmationModal user={mockUser} onClose={mockOnClose} onConfirm={mockOnConfirm} />);
        
        await user.click(screen.getByRole('button', { name: 'Cancelar' }));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('debe llamar a onConfirm con el ID del usuario al hacer clic en "Sí, Eliminar Usuario"', async () => {
        render(<DeleteConfirmationModal user={mockUser} onClose={mockOnClose} onConfirm={mockOnConfirm} />);
        
        await user.click(screen.getByRole('button', { name: 'Sí, Eliminar Usuario' }));
        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
        expect(mockOnConfirm).toHaveBeenCalledWith(mockUser.id);
    });
});