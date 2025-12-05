import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../../../src/pages/auth/LoginPage';

// Mock de hooks
const mockNavigate = vi.fn();
const mockLogin = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('../../../src/context/AuthContext', () => ({
    useAuth: () => ({
        login: mockLogin
    })
}));

vi.mock('../../../src/components/BackToHome', () => ({
    default: () => <div data-testid="back-to-home">Volver al inicio</div>
}));

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe renderizar el formulario de login correctamente', () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/rut/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
        expect(screen.getByTestId('back-to-home')).toBeInTheDocument();
    });

    it('debe mostrar errores de validación si se envía vacío', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

        await waitFor(() => {
            expect(screen.getByText(/el rut es obligatorio/i)).toBeInTheDocument();
            expect(screen.getByText(/la contraseña es obligatoria/i)).toBeInTheDocument();
        });
    });

    it('debe llamar a login y navegar a home si las credenciales son correctas', async () => {
        const user = userEvent.setup();
        mockLogin.mockResolvedValue({ success: true });

        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        const rutInput = screen.getByLabelText(/rut/i);
        const passwordInput = screen.getByLabelText(/contraseña/i);

        await user.type(rutInput, '11.111.111-1');
        await user.type(passwordInput, 'password123');
        await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                rut: '11.111.111-1',
                password: 'password123'
            });
            expect(mockNavigate).toHaveBeenCalledWith('/home');
        });
    });

    it('debe mostrar error si el login falla', async () => {
        const user = userEvent.setup();
        mockLogin.mockResolvedValue({ success: false, error: 'Credenciales inválidas' });

        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        const rutInput = screen.getByLabelText(/rut/i);
        const passwordInput = screen.getByLabelText(/contraseña/i);

        await user.type(rutInput, '11.111.111-1');
        await user.type(passwordInput, 'wrongpassword');
        await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

        await waitFor(() => {
            expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument();
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    it('debe navegar a registro al hacer clic en el enlace', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        await user.click(screen.getByText(/regístrate/i));

        expect(mockNavigate).toHaveBeenCalledWith('/register');
    });
});
