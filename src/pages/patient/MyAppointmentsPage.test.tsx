import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import MyAppointmentsPage from './MyAppointmentsPage';
import type { Appointment } from '../../components/appointments/AppointmentListCard';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('../../components/appointments/AppointmentListCard', () => ({
    AppointmentListCard: (props: Appointment) => (
        <div data-testid="appointment-card">
            {props.doctorName}, {props.specialty}, {props.status}
        </div>
    )
}));

describe('MyAppointmentsPage', () => {
    const user = userEvent.setup();

    beforeEach(() => {
        vi.clearAllMocks();
        render(
            <MemoryRouter>
                <MyAppointmentsPage />
            </MemoryRouter>
        );
    });

    it('debe renderizar el título, filtros y el botón "Nueva Cita"', () => {
        expect(screen.getByText('Mis Citas Médicas')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Buscar por médico o especialidad...')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toHaveValue('Todos');
        expect(screen.getByRole('button', { name: /Nueva Cita/ })).toBeInTheDocument();
    });

    it('debe mostrar las 5 citas mockeadas por defecto, ordenadas por fecha', () => {
        const cards = screen.getAllByTestId('appointment-card');
        expect(cards).toHaveLength(5);
        expect(cards[0]).toHaveTextContent('Dr. Carlos Mendoza'); // 21-01-2024
        expect(cards[1]).toHaveTextContent('Dr. María Rodríguez'); // 14-01-2024
        expect(cards[2]).toHaveTextContent('Dra. Ana Silva'); // 09-12-2023
    });

    it('debe navegar a /book-appointment al hacer clic en "Nueva Cita"', async () => {
        await user.click(screen.getByRole('button', { name: /Nueva Cita/ }));
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/book-appointment');
    });

    it('debe filtrar por especialidad al escribir en la búsqueda', async () => {
        const searchInput = screen.getByPlaceholderText('Buscar por médico o especialidad...');
        await user.type(searchInput, 'Cardiología');
        
        const cards = screen.getAllByTestId('appointment-card');
        expect(cards).toHaveLength(1);
        expect(cards[0]).toHaveTextContent('Dr. Carlos Mendoza');
    });

    it('debe filtrar por estado al cambiar el select', async () => {
        const statusSelect = screen.getByRole('combobox');
        await user.selectOptions(statusSelect, 'Completada');
        
        const cards = screen.getAllByTestId('appointment-card');
        expect(cards).toHaveLength(2);
        expect(cards[0]).toHaveTextContent('Dra. Ana Silva');
        expect(cards[1]).toHaveTextContent('Dr. Luis Torres');
    });

    it('debe filtrar por estado y médico simultáneamente', async () => {
        const statusSelect = screen.getByRole('combobox');
        await user.selectOptions(statusSelect, 'Completada');
        
        const searchInput = screen.getByPlaceholderText('Buscar por médico o especialidad...');
        await user.type(searchInput, 'Luis');

        const cards = screen.getAllByTestId('appointment-card');
        expect(cards).toHaveLength(1);
        expect(cards[0]).toHaveTextContent('Dr. Luis Torres');
    });

    it('debe mostrar un mensaje si no se encuentran resultados', async () => {
        const searchInput = screen.getByPlaceholderText('Buscar por médico o especialidad...');
        await user.type(searchInput, 'NoExisto');
        
        expect(screen.queryByTestId('appointment-card')).not.toBeInTheDocument();
        expect(screen.getByText('No se encontraron citas que coincidan con tu búsqueda.')).toBeInTheDocument();
    });
});