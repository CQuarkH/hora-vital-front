import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ScheduleDayRow } from './ScheduleDayRow';
import type { DaySchedule } from './ScheduleDayRow';

vi.mock('../shared/ToggleSwitch', () => ({
    ToggleSwitch: ({ enabled, onChange, disabled }: any) => (
        <button
            data-testid="mock-toggle"
            role="switch"
            aria-checked={enabled}
            onClick={() => onChange(!enabled)}
            disabled={disabled}
        />
    )
}));

describe('ScheduleDayRow', () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();

    it('renders the day and inputs with initial values', () => {
        const initialSchedule: DaySchedule = {
            isActive: true,
            startTime: '09:00',
            endTime: '17:00',
            breakTime: '12:00-13:00',
            slotDuration: 30,
        };

        render(
            <ScheduleDayRow
                dayName="Lunes"
                initialSchedule={initialSchedule}
                onChange={mockOnChange}
            />
        );

        expect(screen.getByText('Lunes')).toBeInTheDocument();
        expect(screen.getByTestId('mock-toggle')).toHaveAttribute('aria-checked', 'true');
        expect(screen.getByDisplayValue('09:00')).toBeInTheDocument();
        expect(screen.getByDisplayValue('17:00')).toBeInTheDocument();
    });

    it('is disabled when isActive is false', () => {
        const initialSchedule: DaySchedule = {
            isActive: false,
            startTime: '',
            endTime: '',
            breakTime: '',
            slotDuration: 30,
        };

        render(
            <ScheduleDayRow
                dayName="Martes"
                initialSchedule={initialSchedule}
                onChange={mockOnChange}
            />
        );

        expect(screen.getByTestId('mock-toggle')).toHaveAttribute('aria-checked', 'false');
        const timeInputs = Array.from(document.querySelectorAll('input[type="time"]'));
        expect(timeInputs.length).toBeGreaterThanOrEqual(2);
        expect(timeInputs[0]).toBeDisabled();
        expect(timeInputs[1]).toBeDisabled();
    });

    it('calls onChange when toggle is clicked', async () => {
        const initialSchedule: DaySchedule = {
            isActive: false,
            startTime: '',
            endTime: '',
            breakTime: '',
            slotDuration: 30,
        };

        render(<ScheduleDayRow dayName="Miércoles" initialSchedule={initialSchedule} onChange={mockOnChange} />);
        await user.click(screen.getByTestId('mock-toggle'));
        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('calls onChange when start time changes', async () => {
        const initialSchedule: DaySchedule = {
            isActive: true,
            startTime: '09:00',
            endTime: '17:00',
            breakTime: '12:00-13:00',
            slotDuration: 30,
        };

        render(<ScheduleDayRow dayName="Lunes" initialSchedule={initialSchedule} onChange={mockOnChange} />);

        const startTimeInput = screen.getByDisplayValue('09:00');
        await user.clear(startTimeInput);
        await user.type(startTimeInput, '10:00');

        expect(mockOnChange).toHaveBeenCalled();
        expect(startTimeInput).toHaveValue('10:00');
    });

    it('calls onChange when end time changes', async () => {
        const initialSchedule: DaySchedule = {
            isActive: true,
            startTime: '09:00',
            endTime: '17:00',
            breakTime: '12:00-13:00',
            slotDuration: 30,
        };

        render(<ScheduleDayRow dayName="Lunes" initialSchedule={initialSchedule} onChange={mockOnChange} />);

        const endTimeInput = screen.getByDisplayValue('17:00');
        await user.clear(endTimeInput);
        await user.type(endTimeInput, '18:00');

        expect(mockOnChange).toHaveBeenCalled();
        expect(endTimeInput).toHaveValue('18:00');
    });
});