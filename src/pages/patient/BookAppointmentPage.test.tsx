import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import BookAppointmentPage from './BookAppointmentPage';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock de los componentes hijos para aislar la lógica de la página
vi.mock('../../components/appointments/StepSelector', () => ({
    StepSelector: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

vi.mock('../../components/appointments/Calendar', () => ({
    Calendar: ({ onDateChange }: { onDateChange: (date: Date) => void }) => (
        <button onClick={() => onDateChange(new Date('2025-11-04'))}>Elegir 4 Nov</button>
    )
}));

vi.mock('../../components/appointments/TimeSlotPicker', () => ({
    TimeSlotPicker: ({ onTimeChange }: { onTimeChange: (time: string) => void }) => (
        <div>
            <button onClick={() => onTimeChange('10:00')}>10:00</button>
            <button onClick={() => onTimeChange('10:30')}>10:30</button>
        </div>
    )
}));

vi.mock('../../components/appointments/AppointmentSummary', () => ({
    AppointmentSummary: ({ onConfirm, time }: { onConfirm: () => void, time: string | null }) => (
        <div>
            <span data-testid="summary-time">{time || 'No seleccionado'}</span>
            <button onClick={onConfirm}>Confirmar Cita</button>
        </div>
    )
}));

describe('BookAppointmentPage', () => {
    const user = userEvent.setup();

    beforeEach(() => {
        vi.clearAllMocks();
        render(
            <MemoryRouter>
                <BookAppointmentPage />
            </MemoryRouter>
        );
    });

    it('debe renderizar el título y el estado inicial de los steps', () => {
        expect(screen.getByText('Agendar Nueva Cita')).toBeInTheDocument();
        const selects = screen.getAllByRole('combobox');
        expect(selects[0]).toHaveValue(''); // Specialty
        expect(selects[1]).toBeDisabled(); // Doctor
        expect(screen.getByText('Primero selecciona una especialidad')).toBeInTheDocument();
    });

    it('debe habilitar el select de Doctor y mostrar doctores al elegir especialidad', async () => {
        const specialtySelect = screen.getAllByRole('combobox')[0];
        await user.selectOptions(specialtySelect, 'Cardiología');

        const doctorSelect = screen.getAllByRole('combobox')[1];
        expect(doctorSelect).not.toBeDisabled();
        expect(doctorSelect).toHaveValue('');
        
        expect(screen.getByRole('option', { name: 'Dr. Carlos Mendoza' })).toBeInTheDocument();
    });

    it('debe mostrar "Buscando horarios" y luego los slots al seleccionar médico', async () => {
        await user.selectOptions(screen.getAllByRole('combobox')[0], 'Cardiología');
        
        await user.selectOptions(screen.getAllByRole('combobox')[1], 'Dr. Carlos Mendoza');

        expect(screen.getByText('Buscando horarios disponibles...')).toBeInTheDocument();

        await waitFor(() => expect(screen.getByRole('button', { name: '10:00' })).toBeInTheDocument(), { timeout: 1500 });
        expect(screen.getByRole('button', { name: '10:30' })).toBeInTheDocument();
    });

    it('debe actualizar el AppointmentSummary al seleccionar una hora', async () => {
        await user.selectOptions(screen.getAllByRole('combobox')[0], 'Cardiología');
        await user.selectOptions(screen.getAllByRole('combobox')[1], 'Dr. Carlos Mendoza');
        await waitFor(() => expect(screen.getByRole('button', { name: '10:00' })).toBeInTheDocument(), { timeout: 1500 });

        expect(screen.getByTestId('summary-time')).toHaveTextContent('No seleccionado');

        await user.click(screen.getByRole('button', { name: '10:30' }));

        expect(screen.getByTestId('summary-time')).toHaveTextContent('10:30');
    });

    it('debe navegar a la confirmación al hacer clic en "Confirmar Cita"', async () => {
        await user.selectOptions(screen.getAllByRole('combobox')[0], 'Cardiología');
        await user.selectOptions(screen.getAllByRole('combobox')[1], 'Dr. Carlos Mendoza');
           await waitFor(() => expect(screen.getByRole('button', { name: '10:00' })).toBeInTheDocument(), { timeout: 1500 });
        await user.click(screen.getByRole('button', { name: '10:30' }));

        await user.click(screen.getByRole('button', { name: 'Confirmar Cita' }));

        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/appointment-confirmation');
    });

    it('debe resetear el doctor y la hora si la especialidad cambia', async () => {
        await user.selectOptions(screen.getAllByRole('combobox')[0], 'Cardiología');
        await user.selectOptions(screen.getAllByRole('combobox')[1], 'Dr. Carlos Mendoza');
        await waitFor(() => expect(screen.getByRole('button', { name: '10:00' })).toBeInTheDocument(), { timeout: 1500 });
        await user.click(screen.getByRole('button', { name: '10:30' }));

        expect(screen.getAllByRole('combobox')[1]).toHaveValue('Dr. Carlos Mendoza');
        expect(screen.getByTestId('summary-time')).toHaveTextContent('10:30');

        await user.selectOptions(screen.getAllByRole('combobox')[0], 'Pediatría');

        expect(screen.getAllByRole('combobox')[1]).toHaveValue('');
        expect(screen.queryByRole('button', { name: '10:00' })).not.toBeInTheDocument();
        expect(screen.getByTestId('summary-time')).toHaveTextContent('No seleccionado');
    });
});