import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ScheduleDayRow } from '../../components/schedule/ScheduleDayRow';
import type { DaySchedule } from '../../components/schedule/ScheduleDayRow';
import { HiOutlineSave, HiOutlineCalendar, HiOutlinePlusCircle, HiOutlineTemplate } from 'react-icons/hi';
import { SchedulePreviewModal } from '../../components/schedule/SchedulePreviewModal';
import { appointmentService } from '../../services/appointments/appointment_service';
import { adminService } from '../../services/admin/adminService';
import type { Doctor } from '../../types/appointments/appointment_types';

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const DEFAULT_SCHEDULE: Record<string, DaySchedule> = {
    'Lunes': { isActive: true, startTime: '08:00', endTime: '17:00', breakTime: '12:00-13:00', slotDuration: 30 },
    'Martes': { isActive: true, startTime: '08:00', endTime: '17:00', breakTime: '12:00-13:00', slotDuration: 30 },
    'Miércoles': { isActive: true, startTime: '08:00', endTime: '17:00', breakTime: '12:00-13:00', slotDuration: 30 },
    'Jueves': { isActive: true, startTime: '08:00', endTime: '17:00', breakTime: '12:00-13:00', slotDuration: 30 },
    'Viernes': { isActive: true, startTime: '08:00', endTime: '15:00', breakTime: '12:00-13:00', slotDuration: 30 },
    'Sábado': { isActive: false, startTime: '09:00', endTime: '13:00', breakTime: '', slotDuration: 30 },
    'Domingo': { isActive: false, startTime: '09:00', endTime: '13:00', breakTime: '', slotDuration: 30 },
};

export default function ScheduleManagementPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [scheduleData, setScheduleData] = useState(DEFAULT_SCHEDULE);
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

    // Load doctors on mount
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);
                const data = await appointmentService.getDoctors();
                setDoctors(data);
                if (data.length > 0) {
                    setSelectedDoctor(data[0].id);
                }
            } catch (err) {
                console.error('Error loading doctors:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    // Load schedule when doctor changes
    useEffect(() => {
        if (!selectedDoctor) return;

        const fetchSchedule = async () => {
            try {
                const response = await adminService.getSchedules(selectedDoctor);
                // Convert backend schedule to UI format
                const uiSchedule: Record<string, DaySchedule> = { ...DEFAULT_SCHEDULE };

                response.schedules.forEach((schedule: any) => {
                    const dayName = DAY_NAMES[schedule.dayOfWeek];
                    uiSchedule[dayName] = {
                        isActive: schedule.isActive,
                        startTime: schedule.startTime,
                        endTime: schedule.endTime,
                        breakTime: '', // Backend doesn't have breakTime
                        slotDuration: schedule.slotDuration,
                    };
                });

                setScheduleData(uiSchedule);
            } catch (err) {
                console.error('Error loading schedule:', err);
                setScheduleData(DEFAULT_SCHEDULE);
            }
        };
        fetchSchedule();
    }, [selectedDoctor]);

    const handleScheduleChange = (dayName: string, newSchedule: DaySchedule) => {
        setScheduleData(prev => ({
            ...prev,
            [dayName]: newSchedule,
        }));
    };

    const handleSaveChanges = async () => {
        if (!selectedDoctor) return;

        setIsSaving(true);
        try {
            // Convert UI schedule to backend format
            const backendSchedules = Object.entries(scheduleData).map(([dayName, schedule]) => ({
                dayOfWeek: DAY_NAMES.indexOf(dayName),
                startTime: schedule.startTime,
                endTime: schedule.endTime,
                slotDuration: schedule.slotDuration,
                isActive: schedule.isActive,
            }));

            await adminService.updateSchedules(selectedDoctor, backendSchedules);
            toast.success('¡Horarios guardados exitosamente!');
        } catch (err) {
            toast.error('Error al guardar horarios: ' + (err instanceof Error ? err.message : 'Error desconocido'));
        } finally {
            setIsSaving(false);
        }
    };

    const selectedDoctorData = doctors.find(d => d.id === selectedDoctor);
    const selectedDoctorName = selectedDoctorData
        ? `Dr. ${selectedDoctorData.user.firstName} ${selectedDoctorData.user.lastName} - ${selectedDoctorData.specialty.name}`
        : 'Doctor';

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
                        disabled={loading || doctors.length === 0}
                    >
                        {loading ? (
                            <option>Cargando médicos...</option>
                        ) : doctors.length === 0 ? (
                            <option>No hay médicos disponibles</option>
                        ) : (
                            doctors.map(doc => (
                                <option key={doc.id} value={doc.id}>
                                    Dr. {doc.user.firstName} {doc.user.lastName} - {doc.specialty.name}
                                </option>
                            ))
                        )}
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