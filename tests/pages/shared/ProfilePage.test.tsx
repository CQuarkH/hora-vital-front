import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfilePage from '../../../src/pages/shared/ProfilePage';

// Mocks
const mockUpdateProfile = vi.fn();
const mockUser = {
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan@test.com',
    phone: '+56912345678',
    address: 'Calle Falsa 123',
    rut: '11.111.111-1',
    birthDate: '1990-01-01',
    gender: 'Masculino'
};

vi.mock('../../../src/context/AuthContext', () => ({
    useAuth: () => ({
        user: mockUser,
        updateProfile: mockUpdateProfile
    })
}));

vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn()
    }
}));

describe('ProfilePage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe renderizar la información del usuario', () => {
        render(<ProfilePage />);

        expect(screen.getByDisplayValue('Juan')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Pérez')).toBeInTheDocument();
        expect(screen.getByDisplayValue('juan@test.com')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Calle Falsa 123')).toBeInTheDocument();

        // Inputs deben estar deshabilitados inicialmente
        expect(screen.getByLabelText('Nombres')).toBeDisabled();
    });

    it('debe permitir editar al hacer clic en Editar Perfil', async () => {
        const user = userEvent.setup();
        render(<ProfilePage />);

        await user.click(screen.getByText('Editar Perfil'));

        expect(screen.getByLabelText('Nombres')).not.toBeDisabled();
        expect(screen.getByText('Guardar Cambios')).toBeInTheDocument();
        expect(screen.getByText('Cancelar')).toBeInTheDocument();
    });

    it('debe validar campos requeridos al guardar', async () => {
        const user = userEvent.setup();
        render(<ProfilePage />);

        await user.click(screen.getByText('Editar Perfil'));

        const nameInput = screen.getByLabelText('Nombres');
        await user.clear(nameInput);

        await user.click(screen.getByText('Guardar Cambios'));

        await waitFor(() => {
            expect(screen.getByText('Los nombres son requeridos')).toBeInTheDocument();
        });
    });

    it('debe llamar a updateProfile con los nuevos datos', async () => {
        mockUpdateProfile.mockResolvedValue({ success: true, data: { ...mockUser, firstName: 'Pedro' } });
        const user = userEvent.setup();
        render(<ProfilePage />);

        await user.click(screen.getByText('Editar Perfil'));

        const nameInput = screen.getByLabelText('Nombres');
        await user.clear(nameInput);
        await user.type(nameInput, 'Pedro');

        await user.click(screen.getByText('Guardar Cambios'));

        await waitFor(() => {
            expect(mockUpdateProfile).toHaveBeenCalledWith(expect.objectContaining({
                firstName: 'Pedro'
            }));
            expect(screen.getByText('Editar Perfil')).toBeInTheDocument(); // Vuelve a modo vista
        });
    });

    it('debe cancelar la edición y restaurar valores', async () => {
        const user = userEvent.setup();
        render(<ProfilePage />);

        await user.click(screen.getByText('Editar Perfil'));

        const nameInput = screen.getByLabelText('Nombres');
        await user.clear(nameInput);
        await user.type(nameInput, 'Pedro');

        await user.click(screen.getByText('Cancelar'));

        expect(screen.getByDisplayValue('Juan')).toBeInTheDocument();
        expect(screen.getByLabelText('Nombres')).toBeDisabled();
    });
});
