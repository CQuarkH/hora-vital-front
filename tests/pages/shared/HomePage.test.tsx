import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../../../src/pages/shared/HomePage';
import AuthContext from '../../../src/context/AuthContext';
import type { User } from '../../../src/types/auth/auth_types';

vi.mock('../../../src/pages/admin/AdminHomePage', () => ({
    default: () => <div data-testid="admin-home-mock" />
}));
vi.mock('../../../src/pages/patient/PatientHomePage', () => ({
    default: () => <div data-testid="patient-home-mock" />
}));
vi.mock('../../../src/pages/secretary/SecretaryHomePage', () => ({
    default: () => <div data-testid="secretary-home-mock" />
}));
vi.mock('../../../src/pages/auth/OnboardingPage', () => ({
    default: () => <div data-testid="onboarding-mock" />
}));

const renderComponent = (contextValue: Partial<any>) => {
    render(
        <MemoryRouter>
            <AuthContext.Provider value={contextValue as any}>
                <HomePage />
            </AuthContext.Provider>
        </MemoryRouter>
    );
};

describe('HomePage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe mostrar el spinner de carga', () => {
        renderComponent({ loading: true });
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('debe mostrar OnboardingPage si no hay usuario y no está cargando', () => {
        renderComponent({ loading: false, user: null });
        expect(screen.getByTestId('onboarding-mock')).toBeInTheDocument();
    });

    it('debe mostrar AdminHomePage si el rol es "admin"', () => {
        const adminUser = { role: 'admin' } as any as User;
        renderComponent({ loading: false, user: adminUser });
        expect(screen.getByTestId('admin-home-mock')).toBeInTheDocument();
    });

    it('debe mostrar PatientHomePage si el rol es "patient"', () => {
        const patientUser = { role: 'patient' } as any as User;
        renderComponent({ loading: false, user: patientUser });
        expect(screen.getByTestId('patient-home-mock')).toBeInTheDocument();
    });

    it('debe mostrar SecretaryHomePage si el rol es "secretary"', () => {
        const secretaryUser = { role: 'secretary' } as any as User;
        renderComponent({ loading: false, user: secretaryUser });
        expect(screen.getByTestId('secretary-home-mock')).toBeInTheDocument();
    });

    it('debe mostrar un mensaje de fallback si el rol es desconocido', () => {
        const unknownUser = { role: 'unknown-role' } as any as User;
        renderComponent({ loading: false, user: unknownUser });
        expect(screen.getByText('No se encontró un dashboard para tu rol.')).toBeInTheDocument();
    });
});