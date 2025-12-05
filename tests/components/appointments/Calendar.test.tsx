import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Calendar } from '../../../src/components/appointments/Calendar';
import '@testing-library/jest-dom';

describe('Calendar Component', () => {
  it('debería deshabilitar fines de semana', () => {
    vi.useFakeTimers();
    const date = new Date(2024, 4, 1);
    vi.setSystemTime(date);

    render(<Calendar selectedDate={date} onDateChange={() => { }} />);

    const saturday = screen.getByText('4');
    expect(saturday).toBeDisabled();
    expect(saturday).toHaveClass('cursor-not-allowed');

    vi.useRealTimers();
  });

  it('debería mostrar indicadores visuales de disponibilidad', () => {
    vi.useFakeTimers();
    const date = new Date(2024, 4, 1);
    vi.setSystemTime(date);

    render(<Calendar selectedDate={date} onDateChange={() => { }} />);

    const selectedDay = screen.getByText('1');
    expect(selectedDay).toHaveClass('bg-medical-600');
    expect(selectedDay).toHaveClass('text-white');

    const availableDay = screen.getByText('2');
    expect(availableDay).not.toBeDisabled();

    vi.useRealTimers();
  });

  it('debería llamar a onDateSelect cuando se hace clic en un día válido', () => {
    vi.useFakeTimers();
    const date = new Date(2024, 4, 1);
    vi.setSystemTime(date);

    const handleDateSelect = vi.fn();
    render(<Calendar selectedDate={null} onDateChange={handleDateSelect} />);

    const validDay = screen.getByText('2');
    fireEvent.click(validDay);

    expect(handleDateSelect).toHaveBeenCalledWith(expect.any(Date));

    vi.useRealTimers();
  });
});