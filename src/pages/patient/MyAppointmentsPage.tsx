import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppointmentListCard } from '../../components/appointments/AppointmentListCard';
import type { Appointment as UIAppointment } from '../../components/appointments/AppointmentListCard';
import type { AppointmentStatus } from '../../components/appointments/AppointmentStatusBadge';
import { appointmentService } from '../../services/appointments/appointment_service';
import { Appointment as APIAppointment } from '../../types/appointments/appointment_types';
import toast from 'react-hot-toast';

import { HiOutlineSearch, HiOutlineAdjustments, HiOutlinePlus } from 'react-icons/hi';

const STATUS_OPTIONS: AppointmentStatus[] = ['Confirmada', 'Pendiente', 'Completada', 'Cancelada'];

export default function MyAppointmentsPage() {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'Todos'>('Todos');
    const [appointments, setAppointments] = useState<UIAppointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAppointments = async () => {
        setIsLoading(true);
        try {
            const apiAppointments = await appointmentService.getMyAppointments();

            const mappedAppointments: UIAppointment[] = apiAppointments.map((apt: APIAppointment) => {
                const dateObj = new Date(apt.appointmentDate);
                const day = String(dateObj.getDate()).padStart(2, '0');
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const year = dateObj.getFullYear();

                let status: AppointmentStatus = 'Pendiente';
                if (apt.status === 'SCHEDULED') status = 'Confirmada';
                if (apt.status === 'CANCELLED') status = 'Cancelada';
                if (apt.status === 'COMPLETED') status = 'Completada';
                if (apt.status === 'NO_SHOW') status = 'Cancelada';

                return {
                    id: apt.id,
                    doctorName: `Dr. ${apt.doctorProfile.user.firstName} ${apt.doctorProfile.user.lastName}`,
                    specialty: apt.specialty?.name || apt.doctorProfile.specialty?.name || 'General',
                    date: `${day}-${month}-${year}`,
                    time: apt.startTime,
                    location: 'Centro Médico Hora Vital',
                    status: status
                };
            });

            setAppointments(mappedAppointments);
        } catch (error) {
            console.error("Error fetching appointments:", error);
            toast.error("Error al cargar tus citas");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const filteredAppointments = useMemo(() => {
        return appointments
            .filter(cita =>
                statusFilter === 'Todos' || cita.status === statusFilter
            )
            .filter(cita =>
                cita.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cita.specialty.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => new Date(b.date.split('-').reverse().join('-')).getTime() - new Date(a.date.split('-').reverse().join('-')).getTime());
    }, [searchTerm, statusFilter, appointments]);

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
                {isLoading ? (
                    <p className="text-center text-gray-500 py-8">Cargando citas...</p>
                ) : filteredAppointments.length > 0 ? (
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