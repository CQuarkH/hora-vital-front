import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminAppointmentTableRow } from '../../components/secretary/AdminAppointmentTableRow';
import type { AdminAppointment } from '../../components/secretary/AdminAppointmentTableRow';
import type { AppointmentStatus } from '../../components/appointments/AppointmentStatusBadge';
import { Input } from '../../components/Input';
import { HiOutlineArrowLeft, HiOutlineSearch, HiOutlineDocumentDownload } from 'react-icons/hi';

// --- DATOS DE EJEMPLO (MOCK) ---
const MOCK_ALL_APPOINTMENTS: AdminAppointment[] = [
    { id: '1', patientName: 'Juan Carlos González', rut: '12.345.678-9', doctorName: 'Dr. María Rodríguez', date: '2025-11-05', time: '08:30', status: 'Confirmada' },
    { id: '2', patientName: 'Ana María Silva', rut: '98.765.432-1', doctorName: 'Dr. Carlos Mendoza', date: '2025-11-05', time: '09:00', status: 'Pendiente' },
    { id: '3', patientName: 'Pedro Luis Torres', rut: '11.222.333-4', doctorName: 'Dr. María Rodríguez', date: '2025-11-05', time: '09:30', status: 'Confirmada' },
    { id: '4', patientName: 'Carmen Rosa López', rut: '55.666.777-8', doctorName: 'Dra. Ana Silva', date: '2025-11-04', time: '10:00', status: 'Completada' },
    { id: '5', patientName: 'Roberto Andrés Muñoz', rut: '22.333.444-5', doctorName: 'Dr. Carlos Mendoza', date: '2025-11-06', time: '10:30', status: 'Confirmada' },
    { id: '6', patientName: 'Juan Carlos González', rut: '12.345.678-9', doctorName: 'Dr. María Rodríguez', date: '2025-10-20', time: '11:00', status: 'Completada' },
    { id: '7', patientName: 'Ana María Silva', rut: '98.765.432-1', doctorName: 'Dr. Carlos Mendoza', date: '2025-10-22', time: '14:00', status: 'Cancelada' },
];
const MOCK_DOCTORS = ['Todos', 'Dr. María Rodríguez', 'Dr. Carlos Mendoza', 'Dra. Ana Silva'];
const STATUS_OPTIONS: (AppointmentStatus | 'Todos')[] = ['Todos', 'Confirmada', 'Pendiente', 'Completada', 'Cancelada', 'En Atención', 'No Asistió'];

export default function AdminAppointmentsPage() {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [doctorFilter, setDoctorFilter] = useState('Todos');
    const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'Todos'>('Todos');

    const filteredAppointments = useMemo(() => {
        return MOCK_ALL_APPOINTMENTS
            .filter(cita => !dateFrom || cita.date >= dateFrom)
            .filter(cita => !dateTo || cita.date <= dateTo)
            .filter(cita => doctorFilter === 'Todos' || cita.doctorName === doctorFilter)
            .filter(cita => statusFilter === 'Todos' || cita.status === statusFilter)
            .filter(cita => 
                cita.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cita.rut.includes(searchTerm)
            );
    }, [searchTerm, dateFrom, dateTo, doctorFilter, statusFilter]);
    
    const handleView = (id: string) => {
        console.log(`Viendo detalle ${id}`);
    };
    const handleEdit = (id: string) => {
        console.log(`Editando ${id}`);
    };
    const handleCancel = (id: string) => {
        console.log(`Cancelando ${id}`);
        alert(`Simulando cancelación de cita ${id}`);
    };
    
    const handleExport = () => {
        console.log("Exportando reportes...", filteredAppointments);
        alert("Simulando exportación de reportes...");
    };

    return (
        <div className="flex flex-col gap-6">
            <button 
                onClick={() => navigate('/home')} 
                className="flex items-center gap-1 text-sm font-medium text-medical-600 hover:text-medical-800 self-start"
            >
                <HiOutlineArrowLeft />
                Volver al Dashboard
            </button>

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Panel de Citas</h1>
                    <p className="text-gray-600">
                        Gestiona todas las citas programadas en el sistema.
                    </p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-medical-300 text-medical-800 rounded-lg font-medium text-sm hover:bg-medical-50"
                >
                    <HiOutlineDocumentDownload className="h-5 w-5" />
                    Exportar Reportes
                </button>
            </div>

            <div className="p-4 bg-medical-50 border border-medical-200 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="md:col-span-2">
                        <label className="text-sm font-medium">Buscar Paciente</label>
                        <div className="relative mt-1">
                            <input
                                type="text"
                                placeholder="Buscar por nombre o RUT..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-2 pl-10 border border-gray-300 rounded-lg text-sm"
                            />
                            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium">Profesional</label>
                        <select
                            value={doctorFilter}
                            onChange={(e) => setDoctorFilter(e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-lg text-sm"
                        >
                            {MOCK_DOCTORS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium">Estado</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-lg text-sm"
                        >
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium">Fecha (Desde)</label>
                        <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="grid grid-cols-6 gap-4 items-center p-4 border-b border-gray-300 bg-gray-50">
                    <div className="col-span-1 text-sm font-semibold text-gray-600">Paciente</div>
                    <div className="col-span-1 text-sm font-semibold text-gray-600">Profesional</div>
                    <div className="col-span-1 text-sm font-semibold text-gray-600">Fecha</div>
                    <div className="col-span-1 text-sm font-semibold text-gray-600">Hora</div>
                    <div className="col-span-1 text-sm font-semibold text-gray-600">Estado</div>
                    <div className="col-span-1 text-sm font-semibold text-gray-600 text-right">Acciones</div>
                </div>

                {filteredAppointments.length > 0 ? (
                    filteredAppointments.map(cita => (
                        <AdminAppointmentTableRow 
                            key={cita.id} 
                            appointment={cita}
                            onView={handleView}
                            onEdit={handleEdit}
                            onCancel={handleCancel}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500 p-8">
                        No se encontraron citas que coincidan con los filtros.
                    </p>
                )}
            </div>
        </div>
    );
}