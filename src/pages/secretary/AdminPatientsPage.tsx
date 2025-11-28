import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlinePlus, HiOutlineSearch, HiOutlineAdjustments } from 'react-icons/hi';
import { PatientListCard, type PatientData } from '../../components/patients/PatientListCard';
import { SummaryStatCard } from '../../components/patients/SummaryStatCard';
import type { PatientStatus } from '../../components/patients/PatientStatusBadge';
import { adminService, type User } from '../../services/admin/adminService';

const calculateAge = (birthDate?: string): number => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};

const mapUserToPatientData = (user: User): PatientData => {
    return {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        rut: user.rut,
        phone: user.phone || 'N/A',
        email: user.email,
        age: calculateAge(user.birthDate),
        lastVisit: 'N/A', // No disponible en el endpoint
        nextVisit: 'N/A', // No disponible en el endpoint
        totalAppointments: 0, // No disponible en el endpoint
        status: user.isActive ? 'Activo' : 'Inactivo',
    };
};

export default function AdminPatientsPage() {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<PatientStatus | 'Todos'>('Todos');
    const [patients, setPatients] = useState<PatientData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setLoading(true);
                const response = await adminService.getPatients({ page: 1, limit: 1000 });
                const mappedPatients = response.patients.map(mapUserToPatientData);
                setPatients(mappedPatients);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar pacientes');
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    const filteredPatients = useMemo(() => {
        return patients
            .filter(p =>
                statusFilter === 'Todos' || p.status === statusFilter
            )
            .filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.rut.includes(searchTerm)
            );
    }, [patients, searchTerm, statusFilter]);

    const totalActivos = patients.filter(p => p.status === 'Activo').length;
    const totalConCitas = patients.filter(p => p.nextVisit !== 'N/A').length;
    const totalCitas = patients.reduce((sum, p) => sum + p.totalAppointments, 0);

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
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Pacientes</h1>
                    <p className="text-gray-600">
                        Busca, visualiza y gestiona la información de los pacientes
                    </p>
                </div>
                <button
                    onClick={() => navigate('/admin-create-user')}
                    className="flex items-center gap-2 px-4 py-2 bg-medical-700 text-white rounded-lg font-medium hover:bg-medical-800"
                >
                    <HiOutlinePlus className="h-5 w-5" />
                    Registrar Nuevo Paciente
                </button>
            </div>

            <div className="p-4 bg-medical-50 border border-medical-200 rounded-xl flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Buscar por nombre, RUT o email..."
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
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                    <HiOutlineAdjustments className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {loading ? (
                    <p className="text-center text-gray-500 py-8">Cargando pacientes...</p>
                ) : error ? (
                    <p className="text-center text-red-500 py-8">{error}</p>
                ) : filteredPatients.length > 0 ? (
                    filteredPatients.map(patient => (
                        <PatientListCard key={patient.id} patient={patient} />
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-8">
                        No se encontraron pacientes que coincidan con tu búsqueda.
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <SummaryStatCard
                    value={totalActivos}
                    label="Pacientes Activos"
                />
                <SummaryStatCard
                    value={totalConCitas}
                    label="Con Citas Programadas"
                />
                <SummaryStatCard
                    value={totalCitas}
                    label="Total de Citas"
                />
            </div>

        </div>
    );
}