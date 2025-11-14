import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CreateAppointmentPage from './CreateAppointmentPage';

vi.mock('../../components/secretary/PatientSelector', () => ({
    PatientSelector: (props: any) => <div data-testid="patient-selector">Selector</div>
}));

vi.mock('../../components/Input', () => ({
    Input: (props: any) => <input data-testid={props.label || 'input'} {...props} />
}));

describe('CreateAppointmentPage', () => {
    beforeEach(() => vi.clearAllMocks());

    it('renderiza el formulario de agendado y botones', async () => {
        const user = userEvent.setup();
        global.alert = vi.fn();

        render(
            <MemoryRouter>
                <CreateAppointmentPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Agendar Nueva Cita')).toBeInTheDocument();
        const agendarBtn = screen.getByText('Agendar Cita');
        // inicialmente está deshabilitado porque faltan datos
        expect(agendarBtn).toBeDisabled();
    });
});
