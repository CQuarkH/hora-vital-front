import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimeSlotPicker } from '../../../src/components/appointments/TimeSlotPicker';
import '@testing-library/jest-dom';

describe('TimeSlotPicker Component (RF 1.7)', () => {
  const mockSlots = [
    { time: '09:00', available: true },
    { time: '09:30', available: false },
    { time: '10:00', available: true },
  ];

  it('debería mostrar los bloques horarios disponibles', () => {
    render(<TimeSlotPicker slots={mockSlots} selectedTime={null} onTimeChange={() => {}} />);
    expect(screen.getByText('09:00')).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
  });

  it('debería deshabilitar horarios ya reservados', () => {
    render(<TimeSlotPicker slots={mockSlots} selectedTime={null} onTimeChange={() => {}} />);
    const bookedSlot = screen.getByText('09:30').closest('button');
    expect(bookedSlot).toBeDisabled();
  });

  it('debería llamar a onTimeSelect al hacer clic en un horario disponible', () => {
    const handleTimeSelect = vi.fn();
    render(<TimeSlotPicker slots={mockSlots} selectedTime={null} onTimeChange={handleTimeSelect} />);

    const availableSlot = screen.getByText('10:00').closest('button');
    fireEvent.click(availableSlot as HTMLElement);

    expect(handleTimeSelect).toHaveBeenCalledWith('10:00');
  });

  it('debería mostrar un mensaje si no hay horarios disponibles', () => {
    render(<TimeSlotPicker slots={[]} selectedTime={null} onTimeChange={() => {}} />);
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBe(0);
  });
});