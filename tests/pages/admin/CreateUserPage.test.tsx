import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CreateUserPage from '../../../src/pages/admin/CreateUserPage';
import { adminService } from '../../../src/services/admin/adminService';
import { secretaryService } from '../../../src/services/secretary/secretaryService';

// Mocks
const mockNavigate = vi.fn();
const mockUseAuth = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('../../../src/context/AuthContext', () => ({
    useAuth: () => mockUseAuth()
}));

vi.mock('../../../src/services/admin/adminService', () => ({
    adminService: {
        createUser: vi.fn()
    }
}));

vi.mock('../../../src/services/secretary/secretaryService', () => ({
    secretaryService: {
        createPatient: vi.fn()
    }
}));

vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn()
    }
}));

describe('CreateUserPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe renderizar el formulario correctamente para Admin', () => {
        mockUseAuth.mockReturnValue({ user: { role: 'admin' } });
        render(
            <MemoryRouter>
                <CreateUserPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Crear Nuevo Usuario')).toBeInTheDocument();
        expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toHaveValue('secretary');
        expect(screen.getByText('Secretario/a')).toBeInTheDocument();
        expect(screen.getByText('Administrador')).toBeInTheDocument();
    });

    it('debe renderizar el formulario correctamente para Secretaria', () => {
        mockUseAuth.mockReturnValue({ user: { role: 'secretary' } });
        render(
            <MemoryRouter>
                <CreateUserPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Crear Nuevo Usuario')).toBeInTheDocument();
        expect(screen.getByText('Registra un nuevo paciente en el sistema.')).toBeInTheDocument();
        const roleSelect = screen.getByRole('combobox');
        expect(roleSelect).toHaveValue('patient');
        expect(roleSelect.children).toHaveLength(1);
    });

    it('debe llamar a adminService.createUser cuando es Admin', async () => {
        mockUseAuth.mockReturnValue({ user: { role: 'admin' } });
        (adminService.createUser as any).mockResolvedValue({ id: '1' });

        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <CreateUserPage />
            </MemoryRouter>
        );

        await user.type(screen.getByLabelText(/nombre/i), 'Juan');
        await user.type(screen.getByLabelText(/apellido/i), 'Pérez');
        await user.type(screen.getByLabelText(/rut/i), '11.111.111-1');
        await user.type(screen.getByLabelText(/teléfono/i), '+56912345678');
        await user.type(screen.getByLabelText(/correo/i), 'juan@test.com');
        await user.type(screen.getByLabelText(/contraseña/i), '123456');

        await user.click(screen.getByRole('button', { name: /registrar usuario/i }));

        await waitFor(() => {
            expect(adminService.createUser).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/home');
        });
    });

    it('debe llamar a secretaryService.createPatient cuando es Secretaria', async () => {
        mockUseAuth.mockReturnValue({ user: { role: 'secretary' } });
        (secretaryService.createPatient as any).mockResolvedValue({ id: '1' });

        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <CreateUserPage />
            </MemoryRouter>
        );

        await user.type(screen.getByLabelText(/nombre/i), 'Ana');
        await user.type(screen.getByLabelText(/apellido/i), 'López');
        await user.type(screen.getByLabelText(/rut/i), '22.222.222-2');
        await user.type(screen.getByLabelText(/teléfono/i), '+56987654321');
        await user.type(screen.getByLabelText(/correo/i), 'ana@test.com');
        await user.type(screen.getByLabelText(/contraseña/i), '654321');

        await user.click(screen.getByRole('button', { name: /registrar usuario/i }));

        await waitFor(() => {
            expect(secretaryService.createPatient).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/home');
        });
    });

    it('debe mostrar error si falla la creación', async () => {
        mockUseAuth.mockReturnValue({ user: { role: 'admin' } });
        (adminService.createUser as any).mockRejectedValue(new Error('Error al crear'));

        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <CreateUserPage />
            </MemoryRouter>
        );

        await user.type(screen.getByLabelText(/nombre/i), 'Juan');
        await user.type(screen.getByLabelText(/apellido/i), 'Pérez');
        await user.type(screen.getByLabelText(/rut/i), '11.111.111-1');
        await user.type(screen.getByLabelText(/teléfono/i), '+56912345678');
        await user.type(screen.getByLabelText(/correo/i), 'juan@test.com');
        await user.type(screen.getByLabelText(/contraseña/i), '123456');

        await user.click(screen.getByRole('button', { name: /registrar usuario/i }));

        await waitFor(() => {
            expect(screen.getByText('Error al crear')).toBeInTheDocument();
        });
    });
});
