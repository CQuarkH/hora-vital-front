import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RoleCard, type RoleData } from '../../../src/components/admin/RoleCard';

const mockRole: RoleData = {
    id: 'admin-role',
    name: 'Administrador',
    permissions: [{ name: 'crud:users' }, { name: 'view:all' }],
    userCount: 5,
    canBeDeleted: true,
};

describe('RoleCard Component', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();
    const user = userEvent.setup();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe renderizar el nombre del rol', () => {
        render(<RoleCard role={mockRole} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
        expect(screen.getByText('Administrador')).toBeInTheDocument();
    });

    it('debe renderizar la lista de permisos', () => {
        render(<RoleCard role={mockRole} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
        expect(screen.getByText('crud:users')).toBeInTheDocument();
        expect(screen.getByText('view:all')).toBeInTheDocument();
    });

    it('debe renderizar el conteo de usuarios (plural)', () => {
        render(<RoleCard role={mockRole} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
        expect(screen.getByText('5 usuarios asignados')).toBeInTheDocument();
    });

    it('debe renderizar el conteo de usuarios (singular)', () => {
        const singleUserRole = { ...mockRole, userCount: 1 };
        render(<RoleCard role={singleUserRole} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
        expect(screen.getByText('1 usuario asignado')).toBeInTheDocument();
    });

    it('debe llamar a onEdit al hacer clic en el botón de editar', async () => {
        render(<RoleCard role={mockRole} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
        await user.click(screen.getByTitle('Editar Rol'));
        expect(mockOnEdit).toHaveBeenCalledTimes(1);
        expect(mockOnEdit).toHaveBeenCalledWith(mockRole);
    });

    it('debe llamar a onDelete al hacer clic en el botón de eliminar (cuando está habilitado)', async () => {
        render(<RoleCard role={mockRole} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
        await user.click(screen.getByTitle('Eliminar Rol'));
        expect(mockOnDelete).toHaveBeenCalledTimes(1);
        expect(mockOnDelete).toHaveBeenCalledWith(mockRole);
    });

    it('el botón de eliminar debe estar deshabilitado si canBeDeleted es false', () => {
        const nonDeletableRole = { ...mockRole, canBeDeleted: false };
        render(<RoleCard role={nonDeletableRole} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
        
        const deleteButton = screen.getByTitle('No se puede eliminar este rol');
        expect(deleteButton).toBeDisabled();
        expect(deleteButton).toHaveClass('disabled:opacity-30');
    });

    it('no debe llamar a onDelete si el botón está deshabilitado', async () => {
        const nonDeletableRole = { ...mockRole, canBeDeleted: false };
        render(<RoleCard role={nonDeletableRole} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
        
        await user.click(screen.getByTitle('No se puede eliminar este rol'));
        expect(mockOnDelete).not.toHaveBeenCalled();
    });
});