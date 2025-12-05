import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AdminAppointmentsPage from '../../../src/pages/secretary/AdminAppointmentsPage';

vi.mock('../../../src/components/secretary/AdminAppointmentTableRow', () => ({
    AdminAppointmentTableRow: (props: any) => <div data-testid="appointment-row">{props.appointment?.patientName}</div>
}));

vi.mock('../../../src/components/appointments/CancelAppointmentModal', () => ({
    CancelAppointmentModal: (props: any) => <div data-testid="cancel-modal">Cancel</div>
}));

vi.mock('../../../src/components/Input', () => ({
    Input: (props: any) => <input data-testid={props.type || 'input'} {...props} />
}));

vi.mock('react-hot-toast', () => ({
    default: vi.fn(),
}));

vi.mock('../../../src/services/admin/adminService', () => ({
    adminService: {
        getAppointments: vi.fn().mockResolvedValue({
            appointments: [
                {
                    id: '1',
                    appointmentDate: '2025-12-05',
                    startTime: '09:00',
                    patient: { firstName: 'Juan', lastName: 'Pérez', rut: '12.345.678-9' },
                    doctorProfile: {
                        user: { firstName: 'María', lastName: 'González' }
                    },
                    specialty: { name: 'Cardiología' },
                    status: 'SCHEDULED'
                },
                {
                    id: '2',
                    appointmentDate: '2025-12-06',
                    startTime: '10:00',
                    patient: { firstName: 'Ana', lastName: 'Silva', rut: '11.111.111-1' },
                    doctorProfile: {
                        user: { firstName: 'Pedro', lastName: 'Rojas' }
                    },
                    specialty: { name: 'Pediatría' },
                    status: 'SCHEDULED'
                }
            ]
        })
    }
}));

vi.mock('../../../src/services/appointments/appointment_service', () => ({
    appointmentService: {
        cancelAppointment: vi.fn().mockResolvedValue({})
    }
}));

import toast from 'react-hot-toast';

describe('AdminAppointmentsPage', () => {
    beforeEach(() => vi.clearAllMocks());

    it('renderiza el panel y permite exportar', async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <AdminAppointmentsPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Panel de Citas')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getAllByTestId('appointment-row').length).toBeGreaterThan(0);
        });

        const exportButton = screen.getByText(/Exportar Reportes/i);
        await user.click(exportButton);

        await waitFor(() => {
            expect(toast).toHaveBeenCalled();
        });
    });
});
