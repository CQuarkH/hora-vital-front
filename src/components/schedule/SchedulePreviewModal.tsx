import React, { useState } from 'react';
import type { DaySchedule } from './ScheduleDayRow';
import { GeneratedSlotsPreview } from './GeneratedSlotsPreview';
import { Calendar } from '../appointments/Calendar'; 

interface SchedulePreviewModalProps {
    scheduleData: Record<string, DaySchedule>;
    onClose: () => void;
}

const dayIndexToName: { [key: number]: string } = {
    0: 'Domingo',
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado',
};

export const SchedulePreviewModal: React.FC<SchedulePreviewModalProps> = ({ 
    scheduleData, 
    onClose 
}) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const selectedDayName = dayIndexToName[selectedDate.getDay()];
    const daySchedule = scheduleData[selectedDayName];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Vista Previa de Horarios Generados
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-2">1. Selecciona un día</h3>
                        <Calendar 
                            selectedDate={selectedDate}
                            onDateChange={setSelectedDate}
                        />
                    </div>
                    
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-2">
                            2. Horarios para el {selectedDate.toLocaleDateString('es-CL', { dateStyle: 'long' })}
                        </h3>
                        {daySchedule ? (
                            <GeneratedSlotsPreview schedule={daySchedule} />
                        ) : (
                            <p className="text-sm text-gray-500">No hay configuración para este día.</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end mt-8">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 bg-medical-700 text-white rounded-lg font-medium hover:bg-medical-800 transition"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};