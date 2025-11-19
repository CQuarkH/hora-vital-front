import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileTile from '../../src/layouts/ProfileTile';
import { MemoryRouter } from 'react-router-dom';
import type { User } from '../../src/types/auth/auth_types';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const mockUser = {
    id: '1',
    firstName: 'Juan',
    lastName: 'Pérez',
    rut: '12.345.678-9',
    email: 'juan@perez.com',
    role: 'patient',
} as unknown as User;

describe('ProfileTile', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        render(
            <MemoryRouter>
                <ProfileTile {...mockUser} />
            </MemoryRouter>
        );
    });

    it('debe renderizar las iniciales correctas (JP)', () => {
        expect(screen.getByText('JP')).toBeInTheDocument();
    });

    it('debe renderizar el nombre completo y el RUT', () => {
        expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
        expect(screen.getByText('12.345.678-9')).toBeInTheDocument();
    });

    it('debe llamar a navigate("/profile") al hacer clic', async () => {
        const user = userEvent.setup();
        await user.click(screen.getByText('Juan Pérez').parentElement!);
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });
});