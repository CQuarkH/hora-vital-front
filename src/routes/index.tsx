import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoutes';
import OnboardingPage from '../pages/auth/OnboardingPage';
import LoginPage from '../pages/auth/LoginPage';
import MainLayout from '../layouts/MainLayout';
import RegisterPage from '../pages/auth/RegisterPage';


export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <OnboardingPage />,
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
        ],
    },

]);
