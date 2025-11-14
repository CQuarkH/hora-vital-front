import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AdminAppointmentsPage from './AdminAppointmentsPage';

vi.mock('../../components/secretary/AdminAppointmentTableRow', () => ({
    AdminAppointmentTableRow: (props: any) => <div data-testid="appointment-row">{props.appointment?.patientName}</div>
}));

vi.mock('../../components/appointments/CancelAppointmentModal', () => ({
    CancelAppointmentModal: (props: any) => <div data-testid="cancel-modal">Cancel</div>
}));

vi.mock('../../components/Input', () => ({
    Input: (props: any) => <input data-testid={props.type || 'input'} {...props} />
}));

describe('AdminAppointmentsPage', () => {
    beforeEach(() => vi.clearAllMocks());

    it('renderiza el panel y permite exportar', async () => {
        const user = userEvent.setup();
        global.alert = vi.fn();

        render(
            <MemoryRouter>
                <AdminAppointmentsPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Panel de Citas')).toBeInTheDocument();

        const exportButton = screen.getByText(/Exportar Reportes/i);
        await user.click(exportButton);
        expect(global.alert).toHaveBeenCalled();
        expect(screen.getAllByTestId('appointment-row').length).toBeGreaterThan(0);
    });
});
