import React, { useState } from 'react';
import { ScheduleDayRow } from '../../components/schedule/ScheduleDayRow';
import type { DaySchedule } from '../../components/schedule/ScheduleDayRow';
import { HiOutlineSave, HiOutlineCalendar, HiOutlinePlusCircle, HiOutlineTemplate } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { SchedulePreviewModal } from '../../components/schedule/SchedulePreviewModal';

// --- DATOS DE EJEMPLO (MOCK) ---
const MOCK_DOCTORS = [
    { id: '1', name: 'Dr. María Rodríguez - Medicina General' },
    { id: '2', name: 'Dr. Carlos Mendoza - Cardiología' },
];

const MOCK_INITIAL_SCHEDULE: Record<string, DaySchedule> = {
    'Lunes': { isActive: true, startTime: '08:00', endTime: '17:00', breakTime: '12:00-13:00', slotDuration: 30 },
    'Martes': { isActive: true, startTime: '08:00', endTime: '17:00', breakTime: '12:00-13:00', slotDuration: 30 },
    'Miércoles': { isActive: true, startTime: '08:00', endTime: '17:00', breakTime: '12:00-13:00', slotDuration: 30 },
    'Jueves': { isActive: true, startTime: '08:00', endTime: '17:00', breakTime: '12:00-13:00', slotDuration: 30 },
    'Viernes': { isActive: true, startTime: '08:00', endTime: '15:00', breakTime: '12:00-13:00', slotDuration: 30 },
    'Sábado': { isActive: false, startTime: '09:00', endTime: '13:00', breakTime: '', slotDuration: 30 },
    'Domingo': { isActive: false, startTime: '09:00', endTime: '13:00', breakTime: '', slotDuration: 30 },
};

export default function ScheduleManagementPage() {
    const [selectedDoctor, setSelectedDoctor] = useState(MOCK_DOCTORS[0].id);
    const [scheduleData, setScheduleData] = useState(MOCK_INITIAL_SCHEDULE);
    const [isSaving, setIsSaving] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

    const handleScheduleChange = (dayName: string, newSchedule: DaySchedule) => {
        setScheduleData(prev => ({
            ...prev,
            [dayName]: newSchedule,
        }));
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        console.log("Guardando cambios:", { doctorId: selectedDoctor, schedule: scheduleData });
        await new Promise(res => setTimeout(res, 1500));
        setIsSaving(false);
        alert('¡Horarios guardados exitosamente!');
    };

    const selectedDoctorName = MOCK_DOCTORS.find(d => d.id === selectedDoctor)?.name || 'Doctor';

    return (
        <>
            <div className="flex flex-col gap-6">
            
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Agenda</h1>
                    <p className="text-gray-600">
                        Configura horarios y disponibilidad de los médicos
                    </p>
                </div>
                <button
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-medical-700 text-white rounded-lg font-medium hover:bg-medical-800 disabled:bg-gray-400"
                >
                    <HiOutlineSave className="h-5 w-5" />
                    {isSaving ? "Guardando..." : "Guardar Cambios"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-medical-50 border border-medical-200 rounded-xl">
                    <label className="text-sm font-semibold text-medical-900">Seleccionar Médico</label>
                    <select
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
                    >
                        {MOCK_DOCTORS.map(doc => (
                            <option key={doc.id} value={doc.id}>{doc.name}</option>
                        ))}
                    </select>
                </div>
                <div className="p-4 bg-medical-50 border border-medical-200 rounded-xl">
                    <label className="text-sm font-semibold text-medical-900">Periodo</label>
                    <select className="w-full p-2 mt-2 border border-gray-300 rounded-lg">
                        <option value="current">Semana Actual</option>
                        <option value="next">Próxima Semana</option>
                        <option value="template">Plantilla Permanente</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold text-gray-800">
                    Horarios - {selectedDoctorName.split(' - ')[0]}
                </h3>
                <p className="text-sm text-gray-600 -mt-3">
                    Configura los horarios de atención para {selectedDoctorName.split(' - ')[1]}
                </p>

                <div className="flex flex-col gap-3">
                    {Object.entries(scheduleData).map(([day, schedule]) => (
                        <ScheduleDayRow
                            key={day}
                            dayName={day}
                            initialSchedule={schedule}
                            onChange={handleScheduleChange}
                        />
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl justify-center">
                <button className="flex items-center gap-2 text-sm font-medium text-medical-600 hover:text-medical-800">
                    <HiOutlineTemplate />
                    Aplicar Plantilla
                </button>
                <div className="border-l h-5 border-gray-300"></div>
                <button className="flex items-center gap-2 text-sm font-medium text-medical-600 hover:text-medical-800">
                    <HiOutlinePlusCircle />
                    Bloquear Horario
                </button>
                <div className="border-l h-5 border-gray-300"></div>
                    <button
                        type="button"
                        onClick={() => setIsPreviewModalOpen(true)}
                        className="flex items-center gap-2 text-sm font-medium text-medical-600 hover:text-medical-800"
                    >
                        <HiOutlineCalendar />
                        Ver Calendario (Vista Previa)
                    </button>
            </div>
        </div>
            {isPreviewModalOpen && (
                <SchedulePreviewModal
                    scheduleData={scheduleData}
                    onClose={() => setIsPreviewModalOpen(false)}
                />
            )}
        </>
    );
}