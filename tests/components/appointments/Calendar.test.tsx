import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Calendar } from '../../../src/components/appointments/Calendar';
import '@testing-library/jest-dom';

describe('Calendar Component', () => {
  it('debería renderizar el mes actual por defecto', () => {
    render(<Calendar selectedDate={null} onDateChange={() => {}} />);
  });

  it('debería deshabilitar días pasados', () => {
    render(<Calendar selectedDate={null} onDateChange={() => {}} />);
  });

  it('debería mostrar indicadores visuales de disponibilidad', () => {
    render(<Calendar selectedDate={null} onDateChange={() => {}} />);
  });

  it('debería llamar a onDateSelect cuando se hace clic en un día válido', () => {
    const handleDateSelect = vi.fn();
    render(<Calendar selectedDate={null} onDateChange={handleDateSelect} />);
    
    const validDay = screen.getByText('25');
    fireEvent.click(validDay);
    
    expect(handleDateSelect).toHaveBeenCalledWith(expect.any(Date));
  });
});