import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientSelector } from '../../components/secretary/PatientSelector';
import { PatientSearchResult } from '../../components/secretary/PatientSearchResult';
import { Input } from '../../components/Input'; //
import { HiOutlineArrowLeft, HiOutlineCalendar, HiOutlinePencilAlt } from 'react-icons/hi';

// --- DATOS DE EJEMPLO (MOCK) ---
const MOCK_DOCTORS = ["Dr. María Rodríguez", "Dr. Carlos Mendoza", "Dra. Ana Silva"];
const MOCK_TIMES = ["08:30", "09:00", "09:30", "10:00", "10:30"];
const MOCK_APPOINTMENT_TYPES = ["Control", "Primera Vez", "Urgencia", "Examen"];

export default function CreateAppointmentPage() {
    const navigate = useNavigate();

    const [selectedPatient, setSelectedPatient] = useState<PatientSearchResult | null>(null);
    const [doctor, setDoctor] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [type, setType] = useState('');
    const [observations, setObservations] = useState('');

    const handleCancel = () => {
        setSelectedPatient(null);
        setDoctor('');
        setDate('');
        setTime('');
        setType('');
        setObservations('');
    };

    const handleAgendar = () => {
        console.log("Agendando cita:", {
            patientId: selectedPatient?.id,
            doctor,
            date,
            time,
            type,
            observations
        });
        alert('Cita agendada (simulado)');
        navigate('/home');
    };

    const canSubmit = selectedPatient && doctor && date && time && type;

    return (
        <div className="flex flex-col gap-6">
            
            <div>
                <button 
                    onClick={() => navigate('/home')} 
                    className="flex items-center gap-1 text-sm font-medium text-medical-600 hover:text-medical-800 mb-2"
                >
                    <HiOutlineArrowLeft />
                    Volver al Dashboard
                </button>
                <h1 className="text-3xl font-bold text-gray-900">Agendar Nueva Cita</h1>
                <p className="text-gray-600">Programa una cita médica para un paciente</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <PatientSelector 
                    selectedPatient={selectedPatient}
                    onSelectPatient={setSelectedPatient}
                />

                <div className="p-6 bg-medical-50 border border-medical-200 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-medical-900 mb-1">Detalles de la Cita</h3>
                    <p className="text-sm text-gray-600 mb-6">Configura los detalles de la cita médica</p>

                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2 items-start w-full">
                            <label className="text-sm font-medium">Médico</label>
                            <select
                                value={doctor}
                                onChange={(e) => setDoctor(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                            >
                                <option value="" disabled>Seleccionar médico</option>
                                {MOCK_DOCTORS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        <div className="relative">
                            <Input
                                label="Fecha"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                placeholder="dd - mm - aaaa"
                            />
                            <HiOutlineCalendar className="absolute right-2 top-9 text-gray-400" />
                        </div>

                        <div className="flex flex-col gap-2 items-start w-full">
                            <label className="text-sm font-medium">Hora</label>
                            <select
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                            >
                                <option value="" disabled>Seleccionar hora</option>
                                {MOCK_TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2 items-start w-full">
                            <label className="text-sm font-medium">Tipo de Cita</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                            >
                                <option value="" disabled>Seleccionar tipo</option>
                                {MOCK_APPOINTMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        <div className="relative flex flex-col gap-2 items-start w-full">
                            <label className="text-sm font-medium">Observaciones</label>
                            <textarea
                                value={observations}
                                onChange={(e) => setObservations(e.target.value)}
                                rows={4}
                                placeholder="Observaciones adicionales..."
                                className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none"
                            />
                            <HiOutlinePencilAlt className="absolute right-3 bottom-3 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-medical-50 border border-medical-200 rounded-xl shadow-sm">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col md:flex-row md:gap-12">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Paciente</h4>
                            {selectedPatient ? (
                                <div>
                                    <p className="font-semibold text-gray-900">{selectedPatient.name}</p>
                                    <p className="text-sm text-gray-600">RUT: {selectedPatient.rut}</p>
                                    <p className="text-sm text-gray-600">{selectedPatient.phone}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No seleccionado</p>
                            )}
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2 mt-4 md:mt-0">Detalles</h4>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Médico:</span> {doctor || 'No seleccionado'}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Fecha:</span> {date || 'No seleccionada'}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Hora:</span> {time || 'No seleccionada'}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleCancel}
                            className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleAgendar}
                            disabled={!canSubmit}
                            className="px-6 py-2 bg-medical-700 text-white rounded-lg font-medium hover:bg-medical-800 disabled:bg-gray-400"
                        >
                            Agendar Cita
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}