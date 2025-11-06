import React, { useState, useMemo } from 'react';
import { HiOutlineSearch, HiOutlinePlus } from 'react-icons/hi';
import { PatientSearchResult, PatientSearchResult as Patient } from './PatientSearchResult';

// --- DATOS DE EJEMPLO (MOCK) ---
const MOCK_PATIENTS: Patient[] = [
    { id: '1', name: 'Juan Carlos González', rut: '12.345.678-9', phone: '+56 9 1234 5678' },
    { id: '2', name: 'Ana María Silva', rut: '98.765.432-1', phone: '+56 9 8765 4321' },
    { id: '3', name: 'Pedro Luis Torres', rut: '11.222.333-4', phone: '+56 9 5555 6666' },
];
// --- FIN DE DATOS DE EJEMPLO ---

interface PatientSelectorProps {
    selectedPatient: Patient | null;
    onSelectPatient: (patient: Patient) => void;
}

export const PatientSelector: React.FC<PatientSelectorProps> = ({ 
    selectedPatient, 
    onSelectPatient 
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPatients = useMemo(() => {
        if (!searchTerm) {
            return MOCK_PATIENTS;
        }
        return MOCK_PATIENTS.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.rut.includes(searchTerm)
        );
    }, [searchTerm]);

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
                {filteredPatients.map(patient => (
                    <PatientSearchResult
                        key={patient.id}
                        patient={patient}
                        isSelected={selectedPatient?.id === patient.id}
                        onSelect={onSelectPatient}
                    />
                ))}
            </div>

            {/* Botón de Registrar Nuevo Paciente */}
            <button className="w-full flex items-center justify-center gap-2 mt-6 p-3 text-sm font-medium text-medical-700 bg-white border border-medical-200 rounded-lg hover:bg-medical-100">
                <HiOutlinePlus />
                Registrar Nuevo Paciente
            </button>
        </div>
    );
};