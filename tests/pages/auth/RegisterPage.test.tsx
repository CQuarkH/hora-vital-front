import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from '../../../src/pages/auth/RegisterPage';
import AuthContext from '../../../src/context/AuthContext';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('../../../src/utils/validators', async () => {
    const actual = await vi.importActual<typeof import('../../../src/utils/validators')>('../../../src/utils/validators');
    return {
        ...actual,
        isValidRUT: (rut: string) => rut !== '11.111.111-1',
    };
});

vi.mock('../../../src/layouts/Logo', () => ({ default: () => <div>Logo</div> }));
vi.mock('../../../src/components/Input', () => ({
    Input: React.forwardRef(({ label, error, ...props }: any, ref: any) => (
        <label>
            {label}
            <input ref={ref} {...props} />
            {error && <span>{error}</span>}
        </label>
    ))
}));
vi.mock('../../../src/components/Button', () => ({
    Button: ({ children, isLoading, ...props }: any) => <button {...props}>{isLoading ? "Cargando..." : children}</button>
}));


const mockRegisterUser = vi.fn();
const mockAuthContextValue = {
    register: mockRegisterUser,
} as Partial<any>;

const renderComponent = () => {
    render(
        <MemoryRouter>
            <AuthContext.Provider value={mockAuthContextValue as any}>
                <RegisterPage />
            </AuthContext.Provider>
        </MemoryRouter>
    );
};

describe('RegisterPage', () => {
    const user = userEvent.setup();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const fillForm = async () => {
        await user.type(screen.getByLabelText('Nombre'), 'Test');
        await user.type(screen.getByLabelText('Apellido'), 'User');
        await user.type(screen.getByLabelText('RUT'), '12.345.678-9');
        await user.type(screen.getByLabelText('Fecha de Nacimiento'), '2000-01-01');
        await user.type(screen.getByLabelText('Correo'), 'test@user.com');
        await user.type(screen.getByLabelText('Teléfono'), '+56912345678');
        await user.type(screen.getByLabelText('Contraseña'), 'password123');
        await user.type(screen.getByLabelText('Repetir Contraseña'), 'password123');
    };

    it('debe mostrar errores de validación si los campos están vacíos', async () => {
        renderComponent();
        await user.click(screen.getByRole('button', { name: 'Registrarse' }));

        await waitFor(() => {
            expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument();
            expect(screen.getByText('El apellido es obligatorio')).toBeInTheDocument();
            expect(screen.getByText('El RUT es obligatorio')).toBeInTheDocument();
        });
        expect(mockRegisterUser).not.toHaveBeenCalled();
    });

    it('debe mostrar error si las contraseñas no coinciden', async () => {
        renderComponent();
        await user.type(screen.getByLabelText('Contraseña'), 'password123');
        await user.type(screen.getByLabelText('Repetir Contraseña'), 'password456');
        await user.click(screen.getByRole('button', { name: 'Registrarse' }));

        await waitFor(() => {
            expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
        });
    });

    it('debe mostrar error si el RUT es lógicamente inválido (usando mock)', async () => {
        renderComponent();
        await user.type(screen.getByLabelText('RUT'), '11.111.111-1');
        await user.click(screen.getByRole('button', { name: 'Registrarse' }));

        await waitFor(() => {
            expect(screen.getByText('El RUT ingresado no es válido')).toBeInTheDocument();
        });
    });

    it('debe registrar al usuario y navegar a /home si el registro es exitoso', async () => {
        mockRegisterUser.mockResolvedValue({ success: true });
        renderComponent();

        await fillForm();
        await user.click(screen.getByRole('button', { name: 'Registrarse' }));

        await waitFor(() => {
            expect(mockRegisterUser).toHaveBeenCalledTimes(1);
        }, { timeout: 10000 });

        await waitFor(() => {
            expect(mockRegisterUser).toHaveBeenCalledWith(expect.objectContaining({
                firstName: 'Test',
                rut: '12.345.678-9'
            }));
        }, { timeout: 10000 });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/home');
        }, { timeout: 10000 });
    }, 15000);

    it('debe mostrar un error global si el registro falla (error del servidor)', async () => {
        mockRegisterUser.mockResolvedValue({ success: false, error: 'El RUT ya está registrado' });
        renderComponent();

        await fillForm();
        await user.click(screen.getByRole('button', { name: 'Registrarse' }));

        await waitFor(() => {
            expect(mockRegisterUser).toHaveBeenCalledTimes(1);
        }, { timeout: 10000 });

        await waitFor(() => {
            expect(mockNavigate).not.toHaveBeenCalled();
            expect(screen.getByText('El RUT ya está registrado')).toBeInTheDocument();
        }, { timeout: 10000 });
    }, 15000);

    it('debe navegar a /login al hacer clic en "Inicia Sesión"', async () => {
        renderComponent();
        await user.click(screen.getByText('Inicia Sesión'));
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
});