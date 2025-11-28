import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineSearch, HiOutlinePlus } from 'react-icons/hi';
import { PatientSearchResult, PatientSearchResult as Patient } from './PatientSearchResult';
import { adminService, type User } from '../../services/admin/adminService';

interface PatientSelectorProps {
    selectedPatient: Patient | null;
    onSelectPatient: (patient: Patient) => void;
}

export const PatientSelector: React.FC<PatientSelectorProps> = ({
    selectedPatient,
    onSelectPatient
}) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setLoading(true);
                const response = await adminService.getPatients({ page: 1, limit: 1000 });

                // Mapear usuarios del backend al formato PatientSearchResult
                const mappedPatients: Patient[] = response.patients.map((user: User) => ({
                    id: user.id,
                    name: `${user.firstName} ${user.lastName}`,
                    rut: user.rut,
                    phone: user.phone || 'N/A',
                }));

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
        if (!searchTerm) {
            return patients;
        }
        return patients.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.rut.includes(searchTerm)
        );
    }, [searchTerm, patients]);

    return (
        <div className="p-6 bg-medical-50 border border-medical-200 rounded-xl shadow-sm h-full">
            <h3 className="text-lg font-semibold text-medical-900 mb-1">Seleccionar Paciente</h3>
            <p className="text-sm text-gray-600 mb-4">Busca y selecciona el paciente para la cita</p>

            {/* Barra de Búsqueda */}
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Buscar por nombre o RUT..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm"
                />
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            {/* Lista de Resultados */}
            <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
                {loading ? (
                    <p className="text-center text-gray-500 py-4">Cargando pacientes...</p>
                ) : error ? (
                    <p className="text-center text-red-500 py-4">{error}</p>
                ) : filteredPatients.length > 0 ? (
                    filteredPatients.map(patient => (
                        <PatientSearchResult
                            key={patient.id}
                            patient={patient}
                            isSelected={selectedPatient?.id === patient.id}
                            onSelect={onSelectPatient}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-4">
                        No se encontraron pacientes.
                    </p>
                )}
            </div>

            {/* Botón de Registrar Nuevo Paciente */}
            <button
                onClick={() => navigate('/admin-create-user')}
                className="w-full flex items-center justify-center gap-2 mt-6 p-3 text-sm font-medium text-medical-700 bg-white border border-medical-200 rounded-lg hover:bg-medical-100"
            >
                <HiOutlinePlus />
                Registrar Nuevo Paciente
            </button>
        </div>
    );
};