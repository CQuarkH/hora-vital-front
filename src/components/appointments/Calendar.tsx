import React, { useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import clsx from 'clsx';

interface CalendarProps {
    selectedDate: Date | null;
    onDateChange: (date: Date) => void;
}

const weekDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];
const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateChange }) => {
    const [displayDate, setDisplayDate] = useState(selectedDate || new Date());

    const changeMonth = (amount: number) => {
        setDisplayDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + amount);
            return newDate;
        });
    };

    const getCalendarDays = () => {
        const year = displayDate.getFullYear();
        const month = displayDate.getMonth();
        
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const calendarDays = getCalendarDays();
    const today = new Date();

    const isSameDay = (d1: Date, d2: Date | null) => {
        if (!d2) return false;
        return d1.getDate() === d2.getDate() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getFullYear() === d2.getFullYear();
    };

    const isToday = (day: Date) => isSameDay(day, today);
    const isSelected = (day: Date) => isSameDay(day, selectedDate);
    const isDisabled = (day: Date) => day.getDay() === 0 || day.getDay() === 6;

    return (
        <div className="p-4 bg-medical-50 border border-medical-200 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <button 
                    type="button"
                    onClick={() => changeMonth(-1)}
                    className="p-1 text-gray-600 hover:text-medical-700"
                >
                    <HiChevronLeft className="h-5 w-5" />
                </button>
                <span className="font-semibold text-medical-900">
                    {monthNames[displayDate.getMonth()]} {displayDate.getFullYear()}
                </span>
                <button 
                    type="button"
                    onClick={() => changeMonth(1)}
                    className="p-1 text-gray-600 hover:text-medical-700"
                >
                    <HiChevronRight className="h-5 w-5" />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
                {weekDays.map((day) => (
                    <div key={day}>{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                    <button
                        type="button"
                        key={index}
                        disabled={!day || isDisabled(day)}
                        onClick={() => day && onDateChange(day)}
                        className={clsx(
                            "h-8 w-8 rounded-full text-sm transition-colors",
                            !day && "cursor-default", // Días vacíos
                            day && isDisabled(day) && "text-gray-300 line-through cursor-not-allowed", // Fines de semana
                            day && !isDisabled(day) && !isSelected(day) && "hover:bg-medical-200", // Días disponibles
                            day && isToday(day) && !isSelected(day) && "text-medical-600 font-bold", // Hoy
                            day && isSelected(day) && "bg-medical-600 text-white font-bold" // Día seleccionado
                        )}
                    >
                        {day ? day.getDate() : ''}
                    </button>
                ))}
            </div>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
                No se atiende los fines de semana.
            </p>
        </div>
    );
};