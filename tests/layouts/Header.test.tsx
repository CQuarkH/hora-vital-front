import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '../../src/layouts/Header';
import AuthContext from '../../src/context/AuthContext';

// Mocks
const mockNavigate = vi.fn();
const mockLogout = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('../../src/services/notifications/notificationService', () => ({
    notificationService: {
        getUnreadNotifications: vi.fn().mockResolvedValue({
            success: true,
            data: { notifications: [] }
        }),
        markAsRead: vi.fn().mockResolvedValue({ success: true })
    }
}));

vi.mock('../../src/components/notifications/NotificationDropdown', () => ({
    NotificationDropdown: () => <div data-testid="notification-dropdown">Dropdown</div>
}));

vi.mock('../../src/layouts/ProfileTile', () => ({
    default: (props: any) => <div data-testid="profile-tile">{props.firstName}</div>
}));

const mockUser = {
    id: '1',
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'test@test.com',
    role: 'patient',
    status: 'active',
    rut: '12.345.678-9'
};

const renderHeader = (user: any = mockUser) => {
    return render(
        <MemoryRouter>
            <AuthContext.Provider value={{ user, logout: mockLogout } as any}>
                <Header />
            </AuthContext.Provider>
        </MemoryRouter>
    );
};

describe('Header Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe renderizar el logo y título', () => {
        renderHeader();
        expect(screen.getByText('Hora Vital')).toBeInTheDocument();
    });

    it('debe mostrar opciones de login si no hay usuario', () => {
        renderHeader(null);
        expect(screen.getByText('Paciente')).toBeInTheDocument();
        expect(screen.getByText('Secretario/a')).toBeInTheDocument();
        expect(screen.getByText('Administrador')).toBeInTheDocument();
    });

    it('debe mostrar información del usuario si está logueado', () => {
        renderHeader();
        expect(screen.getByText('Paciente')).toBeInTheDocument(); // Role label
        expect(screen.getByTestId('profile-tile')).toHaveTextContent('Juan');
    });

    it('debe navegar a home al hacer clic en el logo si está logueado', async () => {
        const user = userEvent.setup();
        renderHeader();
        await user.click(screen.getByText('Hora Vital'));
        expect(mockNavigate).toHaveBeenCalledWith('/home');
    });

    it('debe navegar a / al hacer clic en el logo si no está logueado', async () => {
        const user = userEvent.setup();
        renderHeader(null);
        await user.click(screen.getByText('Hora Vital'));
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('debe llamar a logout y navegar a login al cerrar sesión', async () => {
        const user = userEvent.setup();
        renderHeader();
        const logoutButton = screen.getByTitle('Cerrar Sesión');
        await user.click(logoutButton);
        expect(mockLogout).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('debe abrir el dropdown de notificaciones al hacer clic', async () => {
        const user = userEvent.setup();
        renderHeader();
        const notifButton = screen.getByTitle('Notificaciones');
        await user.click(notifButton);
        expect(screen.getByTestId('notification-dropdown')).toBeInTheDocument();
    });
});
