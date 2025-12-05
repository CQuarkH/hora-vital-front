import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SecretaryHomePage from '../../../src/pages/secretary/SecretaryHomePage';
import AuthContext from '../../../src/context/AuthContext';

vi.mock('../../../src/components/secretary/TodayAppointmentRow', () => ({
    TodayAppointmentRow: (props: any) => <div data-testid="today-appointment">{props.appointment?.patientName}</div>
}));

vi.mock('../../../src/services/admin/adminService', () => ({
    adminService: {
        getAppointments: vi.fn().mockResolvedValue({
            appointments: [
                {
                    id: '1',
                    startTime: '09:00',
                    patient: { firstName: 'Juan', lastName: 'Pérez', rut: '12.345.678-9' },
                    doctorProfile: {
                        user: { firstName: 'María', lastName: 'González' },
                    },
                    specialty: { name: 'Cardiología' },
                    status: 'SCHEDULED'
                },
                {
                    id: '2',
                    startTime: '10:00',
                    patient: { firstName: 'Ana', lastName: 'Silva', rut: '11.111.111-1' },
                    doctorProfile: {
                        user: { firstName: 'Pedro', lastName: 'Rojas' },
                    },
                    specialty: { name: 'Pediatría' },
                    status: 'SCHEDULED'
                }
            ]
        })
    }
}));

const mockUser = { id: '2', firstName: 'Clara', lastName: 'Pérez', role: 'secretary' } as any;
const mockAuthValue = { user: mockUser } as Partial<any>;

describe('SecretaryHomePage', () => {
    beforeEach(() => vi.clearAllMocks());

    it('muestra el saludo y las citas de hoy', async () => {
        render(
            <MemoryRouter>
                <AuthContext.Provider value={mockAuthValue as any}>
                    <SecretaryHomePage />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByText(/Bienvenida,?\s*Clara/)).toBeInTheDocument();
        expect(screen.getByText('Citas de Hoy')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getAllByTestId('today-appointment').length).toBeGreaterThan(0);
        });
    });
});
