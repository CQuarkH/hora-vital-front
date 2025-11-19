import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../src/routes/ProtectedRoutes';
import { useAuth } from '../../src/context/AuthContext';

// Mock del hook useAuth
vi.mock('../../src/context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

describe('ProtectedRoute', () => {
    const mockUseAuth = vi.mocked(useAuth);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Autenticación requerida (requireAuth=true)', () => {
        it('debe renderizar children si el usuario está autenticado', () => {
            mockUseAuth.mockReturnValue({
                isAuthenticated: () => true,
                hasAnyRole: () => true,
            } as any);

            render(
                <MemoryRouter>
                    <ProtectedRoute>
                        <div>Protected Content</div>
                    </ProtectedRoute>
                </MemoryRouter>
            );

            expect(screen.getByText('Protected Content')).toBeInTheDocument();
        });

        it('debe redirigir a /login si el usuario no está autenticado', () => {
            mockUseAuth.mockReturnValue({
                isAuthenticated: () => false,
                hasAnyRole: () => false,
            } as any);

            render(
                <MemoryRouter initialEntries={['/protected']}>
                    <Routes>
                        <Route
                            path="/protected"
                            element={
                                <ProtectedRoute>
                                    <div>Protected Content</div>
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/login" element={<div>Login Page</div>} />
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.getByText('Login Page')).toBeInTheDocument();
            expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
        });

        it('debe pasar location state al redirigir a login', () => {
            mockUseAuth.mockReturnValue({
                isAuthenticated: () => false,
                hasAnyRole: () => false,
            } as any);

            let locationState: any;

            const LoginPage = () => {
                const location = useLocation();
                locationState = location.state;
                return <div>Login Page</div>;
            };

            render(
                <MemoryRouter initialEntries={['/protected']}>
                    <Routes>
                        <Route
                            path="/protected"
                            element={
                                <ProtectedRoute>
                                    <div>Protected Content</div>
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/login" element={<LoginPage />} />
                    </Routes>
                </MemoryRouter>
            );

            expect(locationState?.from?.pathname).toBe('/protected');
        });
    });

    describe('Sin autenticación requerida (requireAuth=false)', () => {
        it('debe renderizar children si no está autenticado', () => {
            mockUseAuth.mockReturnValue({
                isAuthenticated: () => false,
                hasAnyRole: () => false,
            } as any);

            render(
                <MemoryRouter>
                    <ProtectedRoute requireAuth={false}>
                        <div>Public Content</div>
                    </ProtectedRoute>
                </MemoryRouter>
            );

            expect(screen.getByText('Public Content')).toBeInTheDocument();
        });

        it('debe redirigir a /home si está autenticado', () => {
            mockUseAuth.mockReturnValue({
                isAuthenticated: () => true,
                hasAnyRole: () => true,
            } as any);

            render(
                <MemoryRouter initialEntries={['/login']}>
                    <Routes>
                        <Route
                            path="/login"
                            element={
                                <ProtectedRoute requireAuth={false}>
                                    <div>Login Page</div>
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/home" element={<div>Home Page</div>} />
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.getByText('Home Page')).toBeInTheDocument();
            expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
        });
    });

    describe('Roles permitidos (allowedRoles)', () => {
        it('debe renderizar si el usuario tiene un rol permitido', () => {
            mockUseAuth.mockReturnValue({
                isAuthenticated: () => true,
                hasAnyRole: (roles) => roles.includes('admin'),
            } as any);

            render(
                <MemoryRouter>
                    <ProtectedRoute allowedRoles={['admin', 'secretary']}>
                        <div>Admin Content</div>
                    </ProtectedRoute>
                </MemoryRouter>
            );

            expect(screen.getByText('Admin Content')).toBeInTheDocument();
        });

        it('debe redirigir a /unauthorized si el usuario no tiene rol permitido', () => {
            mockUseAuth.mockReturnValue({
                isAuthenticated: () => true,
                hasAnyRole: () => false,
            } as any);

            render(
                <MemoryRouter initialEntries={['/admin']}>
                    <Routes>
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <div>Admin Content</div>
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/unauthorized" element={<div>Unauthorized</div>} />
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.getByText('Unauthorized')).toBeInTheDocument();
            expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
        });

        it('debe permitir acceso si allowedRoles está vacío', () => {
            mockUseAuth.mockReturnValue({
                isAuthenticated: () => true,
                hasAnyRole: () => false,
            } as any);

            render(
                <MemoryRouter>
                    <ProtectedRoute allowedRoles={[]}>
                        <div>Content</div>
                    </ProtectedRoute>
                </MemoryRouter>
            );

            expect(screen.getByText('Content')).toBeInTheDocument();
        });

        it('debe permitir acceso si allowedRoles no está definido', () => {
            mockUseAuth.mockReturnValue({
                isAuthenticated: () => true,
                hasAnyRole: () => false,
            } as any);

            render(
                <MemoryRouter>
                    <ProtectedRoute>
                        <div>Content</div>
                    </ProtectedRoute>
                </MemoryRouter>
            );

            expect(screen.getByText('Content')).toBeInTheDocument();
        });

        it('debe verificar múltiples roles correctamente', () => {
            mockUseAuth.mockReturnValue({
                isAuthenticated: () => true,
                hasAnyRole: (roles) => roles.includes('patient'),
            } as any);

            render(
                <MemoryRouter>
                    <ProtectedRoute allowedRoles={['admin', 'secretary', 'patient']}>
                        <div>Patient Content</div>
                    </ProtectedRoute>
                </MemoryRouter>
            );

            expect(screen.getByText('Patient Content')).toBeInTheDocument();
        });
    });

    describe('Combinación de requireAuth y allowedRoles', () => {
        it('debe verificar autenticación antes de roles', () => {
            mockUseAuth.mockReturnValue({
                isAuthenticated: () => false,
                hasAnyRole: () => false,
            } as any);

            render(
                <MemoryRouter initialEntries={['/admin']}>
                    <Routes>
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <div>Admin Content</div>
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/login" element={<div>Login Page</div>} />
                        <Route path="/unauthorized" element={<div>Unauthorized</div>} />
                    </Routes>
                </MemoryRouter>
            );

            // Debe ir a login, no a unauthorized
            expect(screen.getByText('Login Page')).toBeInTheDocument();
            expect(screen.queryByText('Unauthorized')).not.toBeInTheDocument();
            expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
        });

        it('debe verificar roles después de autenticación', () => {
            mockUseAuth.mockReturnValue({
                isAuthenticated: () => true,
                hasAnyRole: () => false,
            } as any);

            render(
                <MemoryRouter initialEntries={['/admin']}>
                    <Routes>
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <div>Admin Content</div>
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/login" element={<div>Login Page</div>} />
                        <Route path="/unauthorized" element={<div>Unauthorized</div>} />
                    </Routes>
                </MemoryRouter>
            );

            // Debe ir a unauthorized porque está autenticado pero no tiene el rol
            expect(screen.getByText('Unauthorized')).toBeInTheDocument();
            expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
            expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
        });

        it('debe permitir acceso si está autenticado y tiene rol correcto', () => {
            mockUseAuth.mockReturnValue({
                isAuthenticated: () => true,
                hasAnyRole: (roles) => roles.includes('admin'),
            } as any);

            render(
                <MemoryRouter>
                    <ProtectedRoute allowedRoles={['admin']}>
                        <div>Admin Content</div>
                    </ProtectedRoute>
                </MemoryRouter>
            );

            expect(screen.getByText('Admin Content')).toBeInTheDocument();
        });
    });

    describe('Children rendering', () => {
        it('debe renderizar múltiples children', () => {
            mockUseAuth.mockReturnValue({
                isAuthenticated: () => true,
                hasAnyRole: () => true,
            } as any);

            render(
                <MemoryRouter>
                    <ProtectedRoute>
                        <div>First Child</div>
                        <div>Second Child</div>
                    </ProtectedRoute>
                </MemoryRouter>
            );

            expect(screen.getByText('First Child')).toBeInTheDocument();
            expect(screen.getByText('Second Child')).toBeInTheDocument();
        });

        it('debe renderizar children complejos', () => {
            mockUseAuth.mockReturnValue({
                isAuthenticated: () => true,
                hasAnyRole: () => true,
            } as any);

            render(
                <MemoryRouter>
                    <ProtectedRoute>
                        <div>
                            <h1>Title</h1>
                            <p>Paragraph</p>
                            <button>Button</button>
                        </div>
                    </ProtectedRoute>
                </MemoryRouter>
            );

            expect(screen.getByText('Title')).toBeInTheDocument();
            expect(screen.getByText('Paragraph')).toBeInTheDocument();
            expect(screen.getByText('Button')).toBeInTheDocument();
        });
    });
});

// Necesitamos importar useLocation para el test
import { useLocation } from 'react-router-dom';