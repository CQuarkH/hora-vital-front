import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

// Mock de los componentes y contextos
vi.mock('../src/context/AuthContext', () => ({
    AuthProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="auth-provider">{children}</div>
}));

vi.mock('../src/routes', () => ({
    router: {}
}));

vi.mock('react-router-dom', () => ({
    RouterProvider: () => <div data-testid="router-provider">Router Provider</div>
}));

vi.mock('react-hot-toast', () => ({
    Toaster: () => <div data-testid="toaster">Toaster</div>
}));

describe('App Component', () => {
    it('debe renderizar AuthProvider, RouterProvider y Toaster', () => {
        render(<App />);

        expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
        expect(screen.getByTestId('router-provider')).toBeInTheDocument();
        expect(screen.getByTestId('toaster')).toBeInTheDocument();
    });
});
