import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../../src/layouts/MainLayout';

// Mock del Header
vi.mock('../../src/layouts/Header', () => ({
    Header: () => <div data-testid="header">Header Component</div>
}));

describe('MainLayout', () => {
    it('debe renderizar el Header y el Outlet', () => {
        render(
            <MemoryRouter initialEntries={['/home']}>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path="/home" element={<div>Home Content</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByText('Home Content')).toBeInTheDocument();
    });

    it('no debe renderizar el Header en /login', () => {
        render(
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path="/login" element={<div>Login Content</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(screen.queryByTestId('header')).not.toBeInTheDocument();
        expect(screen.getByText('Login Content')).toBeInTheDocument();
    });

    it('no debe renderizar el Header en /register', () => {
        render(
            <MemoryRouter initialEntries={['/register']}>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path="/register" element={<div>Register Content</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(screen.queryByTestId('header')).not.toBeInTheDocument();
        expect(screen.getByText('Register Content')).toBeInTheDocument();
    });
});
