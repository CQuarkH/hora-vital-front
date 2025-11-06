import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TodayAppointmentRow } from '../../components/secretary/TodayAppointmentRow';
import type { TodayAppointment } from '../../components/secretary/TodayAppointmentRow';
import type { AppointmentStatus } from '../../components/appointments/AppointmentStatusBadge';

import { 
    HiOutlineCalendar, 
    HiOutlinePlus, 
    HiOutlineUsers, 
    HiOutlineSearch,
    HiOutlineAdjustments,
    HiOutlineClipboardList
} from 'react-icons/hi';

// --- DATOS DE EJEMPLO (MOCK) ---
const MOCK_TODAY_APPOINTMENTS: TodayAppointment[] = [
    { id: '1', time: '08:30', patientName: 'Juan Carlos González', appointmentType: 'Control', rut: '12.345.678-9', doctorInfo: 'Dr. María Rodríguez - Medicina General', status: 'Confirmada' },
    { id: '2', time: '09:00', patientName: 'Ana María Silva', appointmentType: 'Primera Vez', rut: '98.765.432-1', doctorInfo: 'Dr. Carlos Mendoza - Cardiología', status: 'Pendiente' },
    { id: '3', time: '09:30', patientName: 'Pedro Luis Torres', appointmentType: 'Control', rut: '11.222.333-4', doctorInfo: 'Dr. María Rodríguez - Medicina General', status: 'Confirmada' },
    { id: '4', time: '10:00', patientName: 'Carmen Rosa López', appointmentType: 'Control', rut: '55.666.777-8', doctorInfo: 'Dra. Ana Silva - Pediatría', status: 'No Asistió' },
    { id: '5', time: '10:30', patientName: 'Roberto Andrés Muñoz', appointmentType: 'Primera Vez', rut: '22.333.444-5', doctorInfo: 'Dr. Carlos Mendoza - Cardiología', status: 'En Atención' },
];
const STATUS_OPTIONS: AppointmentStatus[] = ['Confirmada', 'Pendiente', 'En Atención', 'No Asistió'];

export default function SecretaryHomePage() {
    const { user } = useAuth();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'Todos'>('Todos');

    const filteredAppointments = useMemo(() => {
        return MOCK_TODAY_APPOINTMENTS
            .filter(cita => 
                statusFilter === 'Todos' || cita.status === statusFilter
            )
            .filter(cita => 
                cita.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cita.rut.includes(searchTerm) ||
                cita.doctorInfo.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [searchTerm, statusFilter]);
    
    const AdminDashboardCard: React.FC<{ title: string, icon: React.ReactNode, to: string, description?: string }> = ({ title, icon, to, description }) => {
        const navigateLocal = useNavigate();
        return (
            <button
                onClick={() => navigateLocal(to)}
                className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl bg-medical-50 border border-medical-200 shadow-sm hover:bg-medical-100 transition-all"
            >
                <div className="text-3xl text-medical-700">{icon}</div>
                <span className="font-semibold text-medical-900">{title}</span>
                {description && <span className="text-sm text-gray-600">{description}</span>}
            </button>
        );
    };

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Bienvenida, {user?.firstName || 'Secretaria'}
                </h1>
                <p className="text-gray-600">
                    Panel administrativo para gestión de citas médicas
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdminDashboardCard
                    title="Gestionar Agenda"
                    description="Disponibilidad médicos"
                    icon={<HiOutlineCalendar />}
                    to="/schedule-management"
                />
                <AdminDashboardCard
                    title="Nueva Cita"
                    description="Agendar para paciente"
                    icon={<HiOutlinePlus />}
                    to="/admin-create-appointment"
                />
                <AdminDashboardCard
                    title="Pacientes"
                    description="Buscar y gestionar"
                    icon={<HiOutlineUsers />}
                    to="/admin-patients"
                />
                <AdminDashboardCard
                    title="Panel de Citas"
                    description="Ver historial completo"
                    icon={<HiOutlineClipboardList />}
                    to="/admin-appointments"
                />
            </div>

            <div className="flex flex-col gap-4 p-6 bg-medical-50 border border-medical-200 rounded-xl">
                <div>
                    <h3 className="text-lg font-semibold text-medical-900">
                        Citas de Hoy
                    </h3>
                    <p className="text-sm text-gray-500">
                        Miércoles, 5 de noviembre de 2025
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mt-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Buscar por paciente, RUT o médico..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm"
                        />
                        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="w-full md:w-auto p-3 pl-10 border border-gray-300 rounded-lg text-sm appearance-none"
                        >
                            <option value="Todos">Todos los estados</option>
                            {STATUS_OPTIONS.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        <HiOutlineAdjustments className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                </div>

                <div className="flex flex-col mt-3 bg-white rounded-lg border border-gray-200">
                    {filteredAppointments.length > 0 ? (
                        filteredAppointments.map(cita => (
                            <TodayAppointmentRow key={cita.id} appointment={cita} />
                        ))
                    ) : (
                        <p className="text-center text-gray-500 p-8">
                            No se encontraron citas para hoy que coincidan con tu búsqueda.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}