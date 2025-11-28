import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PatientSelector } from "../../components/secretary/PatientSelector";
import { PatientSearchResult } from "../../components/secretary/PatientSearchResult";
import { Input } from "../../components/Input";
import {
  HiOutlineArrowLeft,
  HiOutlineCalendar,
  HiOutlinePencilAlt,
} from "react-icons/hi";
import { appointmentService } from "../../services/appointments/appointment_service";
import { adminService } from "../../services/admin/adminService";
import type {
  Specialty,
  Doctor,
  TimeSlot,
} from "../../types/appointments/appointment_types";
import { Button } from "../../components/Button";
import { toast } from "react-hot-toast";

export default function CreateAppointmentPage() {
  const navigate = useNavigate();

  const [selectedPatient, setSelectedPatient] =
    useState<PatientSearchResult | null>(null);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([]);

  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [observations, setObservations] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load specialties on mount
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const data = await appointmentService.getSpecialties();
        setSpecialties(data);
      } catch (err) {
        console.error("Error loading specialties:", err);
      }
    };
    fetchSpecialties();
  }, []);

  // Load doctors when specialty changes
  useEffect(() => {
    if (!selectedSpecialty) {
      setDoctors([]);
      setSelectedDoctor("");
      return;
    }

    const fetchDoctors = async () => {
      try {
        const data = await appointmentService.getDoctors(selectedSpecialty);
        setDoctors(data);
      } catch (err) {
        console.error("Error loading doctors:", err);
      }
    };
    fetchDoctors();
  }, [selectedSpecialty]);

  // Load available times when doctor and date change
  useEffect(() => {
    if (!selectedDoctor || !date) {
      setAvailableTimes([]);
      setTime("");
      return;
    }

    const fetchAvailability = async () => {
      try {
        const dateObj = new Date(date + "T00:00:00");
        const slots = await appointmentService.getAvailability(
          dateObj,
          selectedDoctor,
          selectedSpecialty
        );
        setAvailableTimes(slots);
      } catch (err) {
        console.error("Error loading availability:", err);
        setAvailableTimes([]);
      }
    };
    fetchAvailability();
  }, [selectedDoctor, date, selectedSpecialty]);

  const handleCancel = () => {
    setSelectedPatient(null);
    setSelectedSpecialty("");
    setSelectedDoctor("");
    setDate("");
    setTime("");
    setObservations("");
  };

  const handleAgendar = async () => {
    if (
      !selectedPatient ||
      !selectedDoctor ||
      !selectedSpecialty ||
      !date ||
      !time
    ) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await adminService.createAppointmentForPatient({
        patientId: selectedPatient.id,
        doctorProfileId: selectedDoctor,
        specialtyId: selectedSpecialty,
        appointmentDate: date,
        startTime: time,
        notes: observations,
      });

      toast.success("Cita agendada exitosamente");
      navigate("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al agendar cita");
      toast.error(err instanceof Error ? err.message : "Error al agendar cita");
    } finally {
      setLoading(false);
    }
  };

  const canSubmit =
    selectedPatient &&
    selectedDoctor &&
    selectedSpecialty &&
    date &&
    time &&
    !loading;

  const selectedDoctorData = doctors.find((d) => d.id === selectedDoctor);
  const selectedSpecialtyData = specialties.find(
    (s) => s.id === selectedSpecialty
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-1 text-sm font-medium text-medical-600 hover:text-medical-800 mb-2"
        >
          <HiOutlineArrowLeft />
          Volver al Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Agendar Nueva Cita</h1>
        <p className="text-gray-600">
          Programa una cita médica para un paciente
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PatientSelector
          selectedPatient={selectedPatient}
          onSelectPatient={setSelectedPatient}
        />

        <div className="p-6 bg-medical-50 border border-medical-200 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-medical-900 mb-1">
            Detalles de la Cita
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Configura los detalles de la cita médica
          </p>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 items-start w-full">
              <label className="text-sm font-medium">Especialidad</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">Seleccionar especialidad</option>
                {specialties.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2 items-start w-full">
              <label className="text-sm font-medium">Médico</label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                disabled={!selectedSpecialty}
              >
                <option value="">Seleccionar médico</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    Dr. {d.user.firstName} {d.user.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Input
                label="Fecha"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="dd - mm - aaaa"
                disabled={!selectedDoctor}
              />
              <HiOutlineCalendar className="absolute right-2 top-9 text-gray-400" />
            </div>

            <div className="flex flex-col gap-2 items-start w-full">
              <label className="text-sm font-medium">Hora</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                disabled={!date || availableTimes.length === 0}
              >
                <option value="">
                  {availableTimes.length === 0 && date
                    ? "No hay horarios disponibles"
                    : "Seleccionar hora"}
                </option>
                {availableTimes.map((slot) => (
                  <option key={slot.startTime} value={slot.startTime}>
                    {slot.startTime} - {slot.endTime}
                  </option>
                ))}
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

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 bg-medical-50 border border-medical-200 rounded-xl shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex flex-col md:flex-row md:gap-12">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Paciente
              </h4>
              {selectedPatient ? (
                <div>
                  <p className="font-semibold text-gray-900">
                    {selectedPatient.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    RUT: {selectedPatient.rut}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedPatient.phone}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No seleccionado</p>
              )}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2 mt-4 md:mt-0">
                Detalles
              </h4>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Especialidad:</span>{" "}
                {selectedSpecialtyData?.name || "No seleccionada"}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Médico:</span>{" "}
                {selectedDoctorData
                  ? `Dr. ${selectedDoctorData.user.firstName} ${selectedDoctorData.user.lastName}`
                  : "No seleccionado"}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Fecha:</span>{" "}
                {date || "No seleccionada"}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Hora:</span>{" "}
                {time || "No seleccionada"}
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
            <Button
              onClick={handleAgendar}
              disabled={!canSubmit}
              isLoading={loading}
              className="px-6 py-2 bg-medical-700 text-white rounded-lg font-medium hover:bg-medical-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Agendar Cita
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
