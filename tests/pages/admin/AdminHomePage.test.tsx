import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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

vi.mock('../../../src/services/admin/adminService', () => ({
    adminService: {
        getUsers: vi.fn().mockResolvedValue({
            users: [
                {
                    id: '1',
                    firstName: 'Carlos',
                    lastName: 'Mendoza',
                    email: 'carlos@email.com',
                    rut: '22.222.222-2',
                    role: 'DOCTOR',
                    isActive: true,
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z'
                },
                {
                    id: '2',
                    firstName: 'María',
                    lastName: 'González',
                    email: 'maria@email.com',
                    rut: '33.333.333-3',
                    role: 'SECRETARY',
                    isActive: true,
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z'
                },
                {
                    id: '3',
                    firstName: 'Juan',
                    lastName: 'Pérez',
                    email: 'juan@email.com',
                    rut: '11.111.111-1',
                    role: 'PATIENT',
                    isActive: true,
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z'
                }
            ],
            meta: {
                page: 1,
                limit: 1000,
                total: 3,
                totalPages: 1
            }
        })
    }
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

    it('renderiza el título y saludo', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(/Panel de Administración/)).toBeInTheDocument();
        });

        expect(screen.getByText(/Bienvenido,?\s*Admin/)).toBeInTheDocument();
    });

    it('muestra tarjetas de estadísticas y filas de usuario', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getAllByTestId('admin-stat-card').length).toBeGreaterThan(0);
        });

        await waitFor(() => {
            expect(screen.getAllByTestId('user-list-row').length).toBeGreaterThan(0);
        });

        expect(screen.getByText('+ Nuevo Usuario')).toBeInTheDocument();
    });
});
