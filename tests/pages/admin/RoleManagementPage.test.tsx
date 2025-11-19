import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RoleManagementPage from '../../../src/pages/admin/RoleManagementPage';
import AuthContext from '../../../src/context/AuthContext';

vi.mock('../../../src/components/admin/AdminStatCard', () => ({
    AdminStatCard: (props: any) => <div data-testid="admin-stat-card">{props.label}</div>
}));

vi.mock('../../../src/components/admin/RoleCard', () => ({
    RoleCard: (props: any) => <div data-testid="role-card">{props.role?.name}</div>
}));

describe('RoleManagementPage', () => {
    beforeEach(() => vi.clearAllMocks());

    it('muestra la sección de roles y tarjetas', () => {
        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ user: { id: '1', firstName: 'Admin', role: 'admin' } } as any}>
                    <RoleManagementPage />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByText('Roles y Permisos')).toBeInTheDocument();
        expect(screen.getAllByTestId('role-card').length).toBeGreaterThan(0);
    });
});
