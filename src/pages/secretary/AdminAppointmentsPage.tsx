import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AdminAppointmentTableRow } from '../../components/secretary/AdminAppointmentTableRow';
import type { AdminAppointment } from '../../components/secretary/AdminAppointmentTableRow';
import type { AppointmentStatus } from '../../components/appointments/AppointmentStatusBadge';
import { Input } from '../../components/Input';
import { HiOutlineArrowLeft, HiOutlineSearch, HiOutlineDocumentDownload } from 'react-icons/hi';
import { CancelAppointmentModal } from '../../components/appointments/CancelAppointmentModal';
import { adminService } from '../../services/admin/adminService';
import { appointmentService } from '../../services/appointments/appointment_service';

const STATUS_OPTIONS: (AppointmentStatus | 'Todos')[] = ['Todos', 'Confirmada', 'Pendiente', 'Completada', 'Cancelada', 'En Atención', 'No Asistió'];

const mapBackendStatusToFrontend = (status: string): AppointmentStatus => {
    switch (status) {
        case 'SCHEDULED':
            return 'Confirmada';
        case 'COMPLETED':
            return 'Completada';
        case 'CANCELLED':
            return 'Cancelada';
        case 'NO_SHOW':
            return 'No Asistió';
        default:
            return 'Pendiente';
    }
};

const mapFrontendStatusToBackend = (status: AppointmentStatus | 'Todos'): string | undefined => {
    switch (status) {
        case 'Confirmada':
            return 'SCHEDULED';
        case 'Completada':
            return 'COMPLETED';
        case 'Cancelada':
            return 'CANCELLED';
        case 'No Asistió':
            return 'NO_SHOW';
        case 'Todos':
            return undefined;
        default:
            return undefined;
    }
};

export default function AdminAppointmentsPage() {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [doctorFilter, setDoctorFilter] = useState('Todos');
    const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'Todos'>('Todos');

    const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAppointments({ page: 1, limit: 500 });

            const mappedAppointments: AdminAppointment[] = response.appointments.map((apt: any) => ({
                id: apt.id,
                patientName: `${apt.patient.firstName} ${apt.patient.lastName}`,
                rut: apt.patient.rut,
                doctorName: `Dr. ${apt.doctorProfile.user.firstName} ${apt.doctorProfile.user.lastName}`,
                date: apt.appointmentDate,
                time: apt.startTime,
                status: mapBackendStatusToFrontend(apt.status),
            }));

            setAppointments(mappedAppointments);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar citas');
        } finally {
            setLoading(false);
        }
    };

    const filteredAppointments = useMemo(() => {
        return appointments
            .filter(cita => !dateFrom || cita.date >= dateFrom)
            .filter(cita => !dateTo || cita.date <= dateTo)
            .filter(cita => doctorFilter === 'Todos' || cita.doctorName === doctorFilter)
            .filter(cita => statusFilter === 'Todos' || cita.status === statusFilter)
            .filter(cita =>
                cita.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cita.rut.includes(searchTerm)
            );
    }, [appointments, searchTerm, dateFrom, dateTo, doctorFilter, statusFilter]);

    const uniqueDoctors = useMemo(() => {
        const doctors = new Set(appointments.map(apt => apt.doctorName));
        return ['Todos', ...Array.from(doctors)];
    }, [appointments]);

    const handleView = (id: string) => {
        console.log(`Viendo detalle ${id}`);
        navigate(`/appointments/${id}`); 
    };
    
    const handleEdit = (id: string) => {
        console.log(`Editando ${id}`);
        toast('Modal de Edición (aún no implementado)');
    };

    const handleCancel = (id: string) => {
        setSelectedAppointmentId(id);
        setIsCancelModalOpen(true);
    };

    const onConfirmCancel = async (reason: string) => {
        if (!selectedAppointmentId) return;

        try {
            await appointmentService.cancelAppointment(selectedAppointmentId, reason);
            // Refresh appointments after canceling
            await fetchAppointments();
            setIsCancelModalOpen(false);
            setSelectedAppointmentId(null);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Error al cancelar cita');
        }
    };

    const handleExport = () => {
        console.log("Exportando reportes...", filteredAppointments);
        toast('Simulando exportación de reportes...');
    };

    return (
        <>
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
                            {uniqueDoctors.map(d => <option key={d} value={d}>{d}</option>)}
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

                {loading ? (
                    <p className="text-center text-gray-500 p-8">Cargando citas...</p>
                ) : error ? (
                    <p className="text-center text-red-500 p-8">{error}</p>
                ) : filteredAppointments.length > 0 ? (
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
            {isCancelModalOpen && (
                <CancelAppointmentModal
                    appointmentId={selectedAppointmentId ?? ''}
                    onClose={() => { setIsCancelModalOpen(false); setSelectedAppointmentId(null); }}
                    onConfirm={onConfirmCancel}
                />
            )}
        </div>
        </>
    );
}