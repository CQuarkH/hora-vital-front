import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminPatientsPage from '../../../src/pages/secretary/AdminPatientsPage';

vi.mock('../../../src/components/patients/PatientListCard', () => ({
    PatientListCard: (props: any) => <div data-testid="patient-card">{props.patient?.name}</div>
}));

vi.mock('../../../src/components/patients/SummaryStatCard', () => ({
    SummaryStatCard: (props: any) => <div data-testid="summary-card">{props.label}</div>
}));

describe('AdminPatientsPage', () => {
    beforeEach(() => vi.clearAllMocks());

    it('renderiza la sección de pacientes y resúmenes', () => {
        render(
            <MemoryRouter>
                <AdminPatientsPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Gestión de Pacientes')).toBeInTheDocument();
        expect(screen.getAllByTestId('patient-card').length).toBeGreaterThan(0);
        expect(screen.getAllByTestId('summary-card').length).toBeGreaterThan(0);
    });
});
