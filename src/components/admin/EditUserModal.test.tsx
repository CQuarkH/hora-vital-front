import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditUserModal } from './EditUserModal';
import type { SystemUser } from './UserListRow';

const mockUser: SystemUser = {
    id: 'user-123',
    name: 'Ana Torres',
    email: 'ana@torres.com',
    role: 'Secretario/a',
    status: 'Activo',
    lastAccess: 'Hoy'
};

vi.mock('../Input', () => ({
    Input: React.forwardRef(({ label, ...props }: any, ref: any) => (
        <label>
            {label}
            <input ref={ref} {...props} />
        </label>
    ))
}));

describe('EditUserModal', () => {
    const mockOnClose = vi.fn();
    const mockOnSave = vi.fn();
    const user = userEvent.setup();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('no debe renderizar nada si la prop "user" es null', () => {
        render(<EditUserModal user={null} onClose={mockOnClose} onSave={mockOnSave} />);
        expect(screen.queryByText('Editar Usuario')).not.toBeInTheDocument();
    });

    it('debe poblar el formulario con los datos del usuario al abrir (useEffect)', async () => {
        render(<EditUserModal user={mockUser} onClose={mockOnClose} onSave={mockOnSave} />);
        
        await waitFor(() => {
            expect(screen.getByLabelText('Nombre Completo')).toHaveValue(mockUser.name);
            expect(screen.getByLabelText('Email')).toHaveValue(mockUser.email);

            const selects = screen.getAllByRole('combobox');
            const roleSelect = selects.find(s => s.getAttribute('name') === 'role') as HTMLSelectElement;
            const statusSelect = selects.find(s => s.getAttribute('name') === 'status') as HTMLSelectElement;

            expect(roleSelect).toBeDefined();
            expect(statusSelect).toBeDefined();
            expect(roleSelect).toHaveValue(mockUser.role);
            expect(statusSelect).toHaveValue(mockUser.status);
        });
    });

    it('debe llamar a onClose al hacer clic en "Cancelar"', async () => {
        render(<EditUserModal user={mockUser} onClose={mockOnClose} onSave={mockOnSave} />);
        await user.click(screen.getByRole('button', { name: 'Cancelar' }));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('debe llamar a onSave con los datos actualizados al guardar cambios', async () => {
        render(<EditUserModal user={mockUser} onClose={mockOnClose} onSave={mockOnSave} />);

        const nameInput = screen.getByLabelText('Nombre Completo');
        const selects = screen.getAllByRole('combobox');
        const roleSelect = selects.find(s => s.getAttribute('name') === 'role') as HTMLSelectElement;
        const saveButton = screen.getByRole('button', { name: 'Guardar Cambios' });

        await user.clear(nameInput);
        await user.type(nameInput, 'Ana Torres Modificado');
        await user.selectOptions(roleSelect, 'Administrador');
        await user.click(saveButton);

        expect(mockOnSave).toHaveBeenCalledTimes(1);
        expect(mockOnSave).toHaveBeenCalledWith({
            ...mockUser,
            name: 'Ana Torres Modificado',
            email: mockUser.email,
            role: 'Administrador',
            status: mockUser.status,
        });
    });
});