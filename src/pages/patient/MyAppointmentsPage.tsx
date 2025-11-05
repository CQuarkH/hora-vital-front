import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppointmentListCard } from '../../components/appointments/AppointmentListCard';
import type { Appointment } from '../../components/appointments/AppointmentListCard';
import type { AppointmentStatus } from '../../components/appointments/AppointmentStatusBadge';

import { HiOutlineSearch, HiOutlineAdjustments, HiOutlinePlus } from 'react-icons/hi';

// --- DATOS DE EJEMPLO (MOCK) ---
const MOCK_APPOINTMENTS: Appointment[] = [
    { id: '1', doctorName: 'Dr. María Rodríguez', specialty: 'Medicina General', date: '14-01-2024', time: '10:30', location: 'CESFAM San Juan', status: 'Confirmada' },
    { id: '2', doctorName: 'Dr. Carlos Mendoza', specialty: 'Cardiología', date: '21-01-2024', time: '14:00', location: 'CESFAM San Juan', status: 'Pendiente' },
    { id: '3', doctorName: 'Dra. Ana Silva', specialty: 'Pediatría', date: '09-12-2023', time: '09:00', location: 'CESFAM San Juan', status: 'Completada' },
    { id: '4', doctorName: 'Dr. Luis Torres', specialty: 'Medicina General', date: '27-11-2023', time: '15:30', location: 'CESFAM San Juan', status: 'Completada' },
    { id: '5', doctorName: 'Dr. María Rodríguez', specialty: 'Medicina General', date: '14-11-2023', time: '11:00', location: 'CESFAM San Juan', status: 'Cancelada' },
];
const STATUS_OPTIONS: AppointmentStatus[] = ['Confirmada', 'Pendiente', 'Completada', 'Cancelada'];

export default function MyAppointmentsPage() {
    const navigate = useNavigate();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'Todos'>('Todos');

    const filteredAppointments = useMemo(() => {
        return MOCK_APPOINTMENTS
            .filter(cita => 
                statusFilter === 'Todos' || cita.status === statusFilter
            )
            .filter(cita => 
                cita.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cita.specialty.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => new Date(b.date.split('-').reverse().join('-')).getTime() - new Date(a.date.split('-').reverse().join('-')).getTime()); // Ordenar por fecha
    }, [searchTerm, statusFilter]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mis Citas Médicas</h1>
                    <p className="text-gray-600">
                        Historial completo de tus citas agendadas
                    </p>
                </div>
                <button
                    onClick={() => navigate('/book-appointment')}
                    className="flex items-center gap-2 px-4 py-2 bg-medical-700 text-white rounded-lg font-medium hover:bg-medical-800"
                >
                    <HiOutlinePlus className="h-5 w-5" />
                    Nueva Cita
                </button>
            </div>

            <div className="p-4 bg-medical-50 border border-medical-200 rounded-xl flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Buscar por médico o especialidad..."
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

            <div className="flex flex-col gap-4">
                {filteredAppointments.length > 0 ? (
                    filteredAppointments.map(cita => (
                        <AppointmentListCard key={cita.id} {...cita} />
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-8">
                        No se encontraron citas que coincidan con tu búsqueda.
                    </p>
                )}
            </div>
        </div>
    );
}