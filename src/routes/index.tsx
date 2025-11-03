import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoutes';
import OnboardingPage from '../pages/auth/OnboardingPage';
import LoginPage from '../pages/auth/LoginPage';
import MainLayout from '../layouts/MainLayout';
import RegisterPage from '../pages/auth/RegisterPage';
import HomePage from '../pages/shared/HomePage';
import ProfilePage from '../pages/shared/ProfilePage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: (
                    <ProtectedRoute requireAuth={false}>
                        <OnboardingPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'login',
                element: (
                    <ProtectedRoute requireAuth={false}>
                        <LoginPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'register',
                element: (
                    <ProtectedRoute requireAuth={false}>
                        <RegisterPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'unauthorized',
                element: <div>Unauthorized Access</div>,
            },
            {
                path: 'home',
                element: (
                    <ProtectedRoute requireAuth={true}>
                        <HomePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'profile',
                element: (
                    <ProtectedRoute requireAuth={true}>
                        <ProfilePage />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);
