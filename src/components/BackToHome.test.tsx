import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BackToHome from './BackToHome';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('BackToHome Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe renderizar el texto correctamente', () => {
        render(
            <MemoryRouter>
                <BackToHome />
            </MemoryRouter>
        );
        
        expect(screen.getByText('Volver al inicio')).toBeInTheDocument();
        expect(screen.getByText('Volver al inicio').tagName).toBe('SPAN');
    });

    it('debe llamar a navigate("/") cuando se hace clic', async () => {
        render(
            <MemoryRouter>
                <BackToHome />
            </MemoryRouter>
        );

        const link = screen.getByText('Volver al inicio');
        fireEvent.click(link);

        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('debe tener las clases de estilo correctas', () => {
        render(
            <MemoryRouter>
                <BackToHome />
            </MemoryRouter>
        );

        const link = screen.getByText('Volver al inicio');
        expect(link).toHaveClass('text-gray-600', 'cursor-pointer');
    });
});