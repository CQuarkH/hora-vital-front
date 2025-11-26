import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StepSelector } from "../../components/appointments/StepSelector";
import { Calendar } from "../../components/appointments/Calendar";
import { TimeSlotPicker } from "../../components/appointments/TimeSlotPicker";
import type { TimeSlot as PickerTimeSlot } from "../../components/appointments/TimeSlotPicker";
import { AppointmentSummary } from "../../components/appointments/AppointmentSummary";
import { appointmentService } from "../../services/appointments/appointment_service";
import { Specialty, Doctor } from "../../types/appointments/appointment_types";
import toast from "react-hot-toast";

import { FaUserMd, FaStethoscope, FaRegClock } from "react-icons/fa";

export default function BookAppointmentPage() {
  const navigate = useNavigate();

  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [specialtyId, setSpecialtyId] = useState<string | null>(null);
  const [doctorProfileId, setDoctorProfileId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState<string | null>(null);

  const [availableSlots, setAvailableSlots] = useState<PickerTimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar especialidades al inicio
  useEffect(() => {
    appointmentService.getSpecialties()
      .then(setSpecialties)
      .catch(err => console.error("Error cargando especialidades", err));
  }, []);

  useEffect(() => {
    if (specialtyId) {
      setDoctors([]);
      setDoctorProfileId(null);
      setTime(null);
      setAvailableSlots([]);

      appointmentService.getDoctors(specialtyId)
        .then(setDoctors)
        .catch(err => console.error("Error cargando médicos", err));
    } else {
      setDoctors([]);
    }
  }, [specialtyId]);

  // Cargar disponibilidad
  useEffect(() => {
    if (doctorProfileId && selectedDate) {
      setIsLoadingSlots(true);
      setAvailableSlots([]);
      setTime(null);

      appointmentService.getAvailability(selectedDate, doctorProfileId, specialtyId || undefined)
        .then((slots) => {
          const pickerSlots: PickerTimeSlot[] = slots.map(s => ({
            time: s.startTime,
            available: true
          }));
          setAvailableSlots(pickerSlots);
        })
        .catch(err => {
          console.error("Error cargando disponibilidad", err);
          toast.error("Error al cargar horarios disponibles");
        })
        .finally(() => setIsLoadingSlots(false));
    }
  }, [doctorProfileId, selectedDate, specialtyId]);

  const formattedDate = selectedDate
    ? selectedDate
      .toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-")
    : null;

  const selectedSpecialtyName = specialties.find(s => s.id === specialtyId)?.name;
  const selectedDoctorName = doctors.find(d => d.id === doctorProfileId)
    ? `${doctors.find(d => d.id === doctorProfileId)?.user.firstName} ${doctors.find(d => d.id === doctorProfileId)?.user.lastName}`
    : null;

  const handleConfirm = async () => {
    if (!specialtyId || !doctorProfileId || !selectedDate || !time) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setIsSubmitting(true);
    try {
      await appointmentService.createAppointment({
        specialtyId,
        doctorProfileId,
        appointmentDate: selectedDate.toISOString(),
        startTime: time,
        notes: "Agendado desde la web"
      });
        try {
          window.dispatchEvent(new CustomEvent('notifications:refresh'));
        } catch (e) {
        }
      toast.success("Cita agendada exitosamente");
      navigate("/appointment-confirmation");
    } catch (error: any) {
      console.error("Error al agendar:", error);
      toast.error(error.message || "Error al agendar la cita");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Agendar Nueva Cita</h1>
        <p className="text-gray-600">
          Selecciona la especialidad, médico, fecha y hora para tu cita
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <StepSelector
            icon={<FaStethoscope />}
            title="Especialidad"
            description="Selecciona el tipo de consulta médica"
          >
            <select
              value={specialtyId || ""}
              onChange={(e) => setSpecialtyId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm"
            >
              <option value="" disabled>
                Selecciona una especialidad
              </option>
              {specialties.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </StepSelector>

          <StepSelector
            icon={<FaUserMd />}
            title="Médico"
            description="Selecciona el profesional de tu preferencia"
          >
            <select
              value={doctorProfileId || ""}
              onChange={(e) => setDoctorProfileId(e.target.value)}
              disabled={!specialtyId}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm"
            >
              <option value="" disabled>
                {specialtyId
                  ? "Selecciona un médico"
                  : "Primero selecciona una especialidad"}
              </option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.user.firstName} {d.user.lastName}
                </option>
              ))}
            </select>
          </StepSelector>

          <StepSelector
            icon={<FaRegClock />}
            title="Horario"
            description="Selecciona la hora de tu preferencia"
          >
            {isLoadingSlots && (
              <div className="text-sm text-gray-500">
                Buscando horarios disponibles...
              </div>
            )}

            {!isLoadingSlots && availableSlots.length > 0 && (
              <TimeSlotPicker
                slots={availableSlots}
                selectedTime={time}
                onTimeChange={setTime}
              />
            )}

            {!isLoadingSlots && availableSlots.length === 0 && doctorProfileId && (
              <p className="text-sm text-gray-500">
                No hay horarios disponibles para esta fecha.
              </p>
            )}

            {!isLoadingSlots && !doctorProfileId && (
              <p className="text-sm text-gray-500">
                Selecciona un médico y una fecha para ver los horarios.
              </p>
            )}
          </StepSelector>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">
          <Calendar
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />

          <AppointmentSummary
            specialty={selectedSpecialtyName || null}
            doctor={selectedDoctorName || null}
            date={formattedDate}
            time={time}
            onConfirm={handleConfirm}
          />
          {isSubmitting && <p className="text-center text-sm text-gray-500">Procesando...</p>}
        </div>
      </div>
    </div>
  );
}