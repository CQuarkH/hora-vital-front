import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminPatientsPage from '../../../src/pages/secretary/AdminPatientsPage';

vi.mock('../../../src/components/patients/PatientListCard', () => ({
    PatientListCard: (props: any) => <div data-testid="patient-card">{props.patient?.name}</div>
}));

vi.mock('../../../src/components/patients/SummaryStatCard', () => ({
    SummaryStatCard: (props: any) => <div data-testid="summary-card">{props.label}</div>
}));

vi.mock('../../../src/services/admin/adminService', () => ({
    adminService: {
        getPatients: vi.fn().mockResolvedValue({
            patients: [
                {
                    id: '1',
                    firstName: 'Juan',
                    lastName: 'Pérez',
                    rut: '12.345.678-9',
                    phone: '+56912345678',
                    email: 'juan@email.com',
                    birthDate: '1990-01-01',
                    isActive: true
                },
                {
                    id: '2',
                    firstName: 'Ana',
                    lastName: 'Silva',
                    rut: '11.111.111-1',
                    phone: '+56987654321',
                    email: 'ana@email.com',
                    birthDate: '1985-05-15',
                    isActive: true
                }
            ]
        })
    }
}));

describe('AdminPatientsPage', () => {
    beforeEach(() => vi.clearAllMocks());

    it('renderiza la sección de pacientes y resúmenes', async () => {
        render(
            <MemoryRouter>
                <AdminPatientsPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Gestión de Pacientes')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getAllByTestId('patient-card').length).toBeGreaterThan(0);
            expect(screen.getAllByTestId('summary-card').length).toBeGreaterThan(0);
        });
    });
});
