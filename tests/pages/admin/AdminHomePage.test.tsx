import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminHomePage from '../../../src/pages/admin/AdminHomePage';
import AuthContext from '../../../src/context/AuthContext';

vi.mock('../../../src/components/admin/AdminStatCard', () => ({
    AdminStatCard: (props: any) => <div data-testid="admin-stat-card">{props.label}</div>
}));

vi.mock('../../../src/components/admin/UserListRow', () => ({
    UserListRow: (props: any) => <div data-testid="user-list-row">{props.user?.name}</div>
}));

vi.mock('../../../src/components/admin/EditUserModal', () => ({
    EditUserModal: (props: any) => <div data-testid="edit-user-modal">Edit Modal</div>
}));

vi.mock('../../../src/components/admin/DeleteConfirmationModal', () => ({
    DeleteConfirmationModal: (props: any) => <div data-testid="delete-user-modal">Delete Modal</div>
}));

const mockUser = { id: '1', firstName: 'Admin', lastName: 'Test', role: 'admin' } as any;
const mockAuthValue = { user: mockUser } as Partial<any>;

const renderComponent = () => render(
    <MemoryRouter>
        <AuthContext.Provider value={mockAuthValue as any}>
            <AdminHomePage />
        </AuthContext.Provider>
    </MemoryRouter>
);

describe('AdminHomePage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renderiza el título y saludo', () => {
        renderComponent();
        expect(screen.getByText(/Panel de Administración/)).toBeInTheDocument();
        expect(screen.getByText(/Bienvenido,?\s*Admin/)).toBeInTheDocument();
    });

    it('muestra tarjetas de estadísticas y filas de usuario', () => {
        renderComponent();
        expect(screen.getAllByTestId('admin-stat-card').length).toBeGreaterThan(0);
        expect(screen.getAllByTestId('user-list-row').length).toBeGreaterThan(0);
        expect(screen.getByText('+ Nuevo Usuario')).toBeInTheDocument();
    });
});
