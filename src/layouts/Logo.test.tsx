import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Logo from './Logo';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Logo Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        render(
            <MemoryRouter>
                <Logo />
            </MemoryRouter>
        );
    });

    it('debe renderizar el nombre "Hora Vital"', () => {
        expect(screen.getByText('Hora Vital')).toBeInTheDocument();
    });

    it('debe navegar a "/home" al hacer clic', () => {
        const logoContainer = screen.getByText('Hora Vital').parentElement;
        expect(logoContainer).toBeInTheDocument();

        fireEvent.click(logoContainer!);
        
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/home');
    });

    it('debe contener el ícono FaHeartbeat', () => {
        const logoContainer = screen.getByText('Hora Vital').parentElement;
        const svg = logoContainer?.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg?.querySelector('path')).toBeInTheDocument();
    });
});