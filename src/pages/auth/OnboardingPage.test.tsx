import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import OnboardingPage from './OnboardingPage';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('OnboardingPage', () => {
    const user = userEvent.setup();

    beforeEach(() => {
        vi.clearAllMocks();
        render(
            <MemoryRouter>
                <OnboardingPage />
            </MemoryRouter>
        );
    });

    it('debe renderizar los títulos y descripciones principales', () => {
        expect(screen.getByText('Gestión de Citas Médicas Simplificada')).toBeInTheDocument();
        expect(screen.getByText('Características Principales')).toBeInTheDocument();
    });

    it('debe renderizar las 3 tarjetas de características (FeatureCard)', () => {
        expect(screen.getByText('Agendamiento Fácil')).toBeInTheDocument();
        expect(screen.getByText('Gestión Administrativa')).toBeInTheDocument();
        expect(screen.getByText('Seguro y Confiable')).toBeInTheDocument();
    });

    it('debe navegar a "/login/form" al hacer clic en "Agendar Cita"', async () => {
        await user.click(screen.getByRole('button', { name: /Agendar Cita/ }));
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/login/form');
    });

    it('debe navegar a "/login/form" al hacer clic en "Acceso Administrativo"', async () => {
        await user.click(screen.getByRole('button', { name: /Acceso Administrativo/ }));
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/login/form');
    });
});