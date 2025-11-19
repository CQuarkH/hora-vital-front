import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SecretaryHomePage from '../../../src/pages/secretary/SecretaryHomePage';
import AuthContext from '../../../src/context/AuthContext';

vi.mock('../../../src/components/secretary/TodayAppointmentRow', () => ({
    TodayAppointmentRow: (props: any) => <div data-testid="today-appointment">{props.appointment?.patientName}</div>
}));

const mockUser = { id: '2', firstName: 'Clara', lastName: 'Pérez', role: 'secretary' } as any;
const mockAuthValue = { user: mockUser } as Partial<any>;

describe('SecretaryHomePage', () => {
    beforeEach(() => vi.clearAllMocks());

    it('muestra el saludo y las citas de hoy', () => {
        render(
            <MemoryRouter>
                <AuthContext.Provider value={mockAuthValue as any}>
                    <SecretaryHomePage />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByText(/Bienvenida,?\s*Clara/)).toBeInTheDocument();
        expect(screen.getByText('Citas de Hoy')).toBeInTheDocument();
        expect(screen.getAllByTestId('today-appointment').length).toBeGreaterThan(0);
    });
});
