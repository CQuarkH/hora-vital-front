import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoutes';
import OnboardingPage from '../pages/auth/OnboardingPage';
import LoginPage from '../pages/auth/LoginPage';
import MainLayout from '../layouts/MainLayout';
import RegisterPage from '../pages/auth/RegisterPage';
import HomePage from '../pages/shared/HomePage';
import ProfilePage from '../pages/shared/ProfilePage';
import BookAppointmentPage from '../pages/patient/BookAppointmentPage';
import MyAppointmentsPage from '../pages/patient/MyAppointmentsPage';
import NotificationsPage from '../pages/patient/NotificationsPage';

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
            {
                path: 'book-appointment',
                element: (
                    <ProtectedRoute requireAuth={true} allowedRoles={['patient']}>
                        <BookAppointmentPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'appointments',
                element: (
                    <ProtectedRoute requireAuth={true} allowedRoles={['patient']}>
                        <MyAppointmentsPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'appointments/:id',
                element: (
                    <ProtectedRoute requireAuth={true} allowedRoles={['patient']}>
                        <MyAppointmentsPage /> 
                    </ProtectedRoute>
                ),
            },
            {
                path: 'notifications',
                element: (
                    <ProtectedRoute requireAuth={true} allowedRoles={['patient']}>
                        <NotificationsPage />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);