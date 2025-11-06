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
import ScheduleManagementPage from '../pages/secretary/ScheduleManagementPage';
import AdminPatientsPage from '../pages/secretary/AdminPatientsPage';
import AdminSettingsPage from '../pages/secretary/AdminSettingsPage';
import CreateAppointmentPage from '../pages/secretary/CreateAppointmentPage';
import CreateUserPage from '../pages/admin/CreateUserPage';
import RoleManagementPage from '../pages/admin/RoleManagementPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, element: <Navigate to="home" replace /> },

            {
                path: 'home',
                element: <HomePage />,
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
                path: 'schedule-management',
                element: (
                    <ProtectedRoute requireAuth={true} allowedRoles={['secretary','admin']}> 
                        <ScheduleManagementPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'admin-patients',
                element: (
                    <ProtectedRoute requireAuth={true} allowedRoles={['secretary','admin']}>
                        <AdminPatientsPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'admin-settings',
                element: (
                    <ProtectedRoute requireAuth={true} allowedRoles={['secretary','admin']}>
                        <AdminSettingsPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'admin-create-appointment',
                element: (
                    <ProtectedRoute requireAuth={true} allowedRoles={['secretary','admin']}>
                        <CreateAppointmentPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'admin-create-user',
                element: (
                    <ProtectedRoute requireAuth={true} allowedRoles={['admin']}>
                        <CreateUserPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'admin-roles',
                element: (
                    <ProtectedRoute requireAuth={true} allowedRoles={['admin']}>
                        <RoleManagementPage />
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
                <HomePage />
            </ProtectedRoute>
        ),
    },
    {
        path: '/login/form',
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