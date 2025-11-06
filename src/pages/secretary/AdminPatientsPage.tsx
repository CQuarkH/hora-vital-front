import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlinePlus, HiOutlineSearch, HiOutlineAdjustments } from 'react-icons/hi';
import { PatientListCard, type PatientData } from '../../components/patients/PatientListCard';
import { SummaryStatCard } from '../../components/patients/SummaryStatCard';
import type { PatientStatus } from '../../components/patients/PatientStatusBadge';

// --- DATOS DE EJEMPLO (MOCK) ---
const MOCK_PATIENTS_DATA: PatientData[] = [
    { id: '1', name: 'Juan Carlos González', rut: '12.345.678-9', phone: '+56 9 1234 5678', email: 'juan.gonzalez@email.com', age: 40, lastVisit: '14-01-2024', nextVisit: '19-02-2024', totalAppointments: 12, status: 'Activo' },
    { id: '2', name: 'Ana María Silva', rut: '98.765.432-1', phone: '+56 9 8765 4321', email: 'ana.silva@email.com', age: 35, lastVisit: '09-01-2024', nextVisit: 'N/A', totalAppointments: 8, status: 'Activo' },
    { id: '3', name: 'Pedro Luis Torres', rut: '11.222.333-4', phone: '+56 9 5555 6666', email: 'pedro.torres@email.com', age: 45, lastVisit: '07-01-2024', nextVisit: '14-02-2024', totalAppointments: 25, status: 'Activo' },
    { id: '4', name: 'Carmen Rosa López', rut: '55.666.777-8', phone: '+56 9 7777 8888', email: 'carmen.lopez@email.com', age: 30, lastVisit: '15-12-2023', nextVisit: 'N/A', totalAppointments: 3, status: 'Inactivo' },
    { id: '5', name: 'Roberto Andrés Muñoz', rut: '22.333.444-5', phone: '+56 9 9999 0000', email: 'roberto.munoz@email.com', age: 43, lastVisit: '17-01-2024', nextVisit: '24-02-2024', totalAppointments: 15, status: 'Activo' },
];

export default function AdminPatientsPage() {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<PatientStatus | 'Todos'>('Todos');

    const filteredPatients = useMemo(() => {
        return MOCK_PATIENTS_DATA
            .filter(p => 
                statusFilter === 'Todos' || p.status === statusFilter
            )
            .filter(p => 
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.rut.includes(searchTerm)
            );
    }, [searchTerm, statusFilter]);

    const totalActivos = MOCK_PATIENTS_DATA.filter(p => p.status === 'Activo').length;
    const totalConCitas = MOCK_PATIENTS_DATA.filter(p => p.nextVisit !== 'N/A').length;
    const totalCitas = MOCK_PATIENTS_DATA.reduce((sum, p) => sum + p.totalAppointments, 0);

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
                {filteredPatients.length > 0 ? (
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