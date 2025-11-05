import { createBrowserRouter, Navigate } from 'react-router-dom';
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
import AppointmentConfirmationPage from '../pages/patient/AppointmentConfirmationPage';
import AppointmentDetailPage from '../pages/patient/AppointmentDetailPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, element: <Navigate to="home" replace /> },

            {
                path: 'home',
                element: (
                    <ProtectedRoute requireAuth={true} allowedRoles={['patient','secretary','admin']}>
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
                        <AppointmentDetailPage /> 
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
            {
                path: 'appointment-confirmation',
                element: (
                    <ProtectedRoute requireAuth={true} allowedRoles={['patient']}>
                        <AppointmentConfirmationPage />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: '/login',
        element: (
            <ProtectedRoute requireAuth={false}>
                <LoginPage />
            </ProtectedRoute>
        ),
    },
    {
        path: '/register',
        element: (
            <ProtectedRoute requireAuth={false}>
                <RegisterPage />
            </ProtectedRoute>
        ),
    },
    {
        path: '/onboarding',
        element: (
            <ProtectedRoute requireAuth={false}>
                <OnboardingPage />
            </ProtectedRoute>
        ),
    },

    { path: '*', element: <Navigate to="/home" replace /> },
]);