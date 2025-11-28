import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaUserMd,
  FaStethoscope,
  FaRegClock,
  FaStickyNote,
  FaArrowLeft,
} from "react-icons/fa";

import { StepSelector } from "../../components/appointments/StepSelector";
import { Calendar } from "../../components/appointments/Calendar";
import {
  TimeSlotPicker,
  type TimeSlot as PickerTimeSlot,
} from "../../components/appointments/TimeSlotPicker";
import { AppointmentSummary } from "../../components/appointments/AppointmentSummary";

import { appointmentService } from "../../services/appointments/appointment_service";
import type {
  Specialty,
  Doctor,
} from "../../types/appointments/appointment_types";

interface UpdateAppointmentDTO {
  specialtyId: string;
  doctorProfileId: string;
  appointmentDate: string;
  startTime: string;
  notes?: string;
}

const formatDateForDisplay = (date: Date | null): string | null => {
  if (!date) return null;
  return date
    .toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");
};

export default function EditAppointmentPage() {
  const navigate = useNavigate();
  const { id: appointmentId } = useParams<{ id: string }>();

  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableSlots, setAvailableSlots] = useState<PickerTimeSlot[]>([]);

  const [specialtyId, setSpecialtyId] = useState<string | null>(null);
  const [doctorProfileId, setDoctorProfileId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>("");

  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!appointmentId) {
        toast.error("ID de cita no válido");
        navigate("/appointments");
        return;
      }

      setIsLoadingInitialData(true);
      try {
        const [specialtiesData, appointmentData] = await Promise.all([
          appointmentService.getSpecialties(),
          appointmentService.getAppointmentById(appointmentId),
        ]);

        setSpecialties(specialtiesData);
        setSpecialtyId(appointmentData.specialty.id);
        setDoctorProfileId(appointmentData.doctorProfile.id);

        const existingDate = new Date(appointmentData.appointmentDate);
        setSelectedDate(existingDate);
        setTime(appointmentData.startTime);
        setNotes(appointmentData.notes || "");
      } catch (error) {
        console.error("Error cargando datos iniciales:", error);
        toast.error("No se pudo cargar la información de la cita");
        navigate("/appointments");
      } finally {
        setIsLoadingInitialData(false);
      }
    };

    fetchInitialData();
  }, [appointmentId, navigate]);

  useEffect(() => {
    if (isLoadingInitialData) return;

    if (!specialtyId) {
      setDoctors([]);
      return;
    }

    setTime(null);
    setAvailableSlots([]);

    appointmentService
      .getDoctors(specialtyId)
      .then(setDoctors)
      .catch((err) => {
        console.error("Error cargando médicos", err);
        toast.error("Error al cargar lista de médicos");
      });
  }, [specialtyId, isLoadingInitialData]);

  const fetchAvailability = useCallback(
    async (date: Date, docId: string, specId: string) => {
      setIsLoadingSlots(true);
      setAvailableSlots([]);

      try {
        const slots = await appointmentService.getAvailability(
          date,
          docId,
          specId
        );
        const pickerSlots: PickerTimeSlot[] = slots.map((s) => ({
          time: s.startTime,
          available: true,
        }));
        setAvailableSlots(pickerSlots);
      } catch (err) {
        console.error("Error cargando disponibilidad", err);
        toast.error("Error al cargar horarios disponibles");
      } finally {
        setIsLoadingSlots(false);
      }
    },
    []
  );

  useEffect(() => {
    if (
      doctorProfileId &&
      selectedDate &&
      specialtyId &&
      !isLoadingInitialData
    ) {
      fetchAvailability(selectedDate, doctorProfileId, specialtyId);
    }
  }, [
    doctorProfileId,
    selectedDate,
    specialtyId,
    isLoadingInitialData,
    fetchAvailability,
  ]);

  useEffect(() => {
    if (time && availableSlots.length > 0 && !isLoadingSlots) {
      const isTimeStillAvailable = availableSlots.some(
        (slot) => slot.time === time && slot.available
      );
      if (!isTimeStillAvailable) {
        setTime(null);
        toast("El horario seleccionado previamente ya no está disponible.", {
          icon: "⚠️",
        });
      }
    }
  }, [availableSlots, isLoadingSlots, time]);

  const handleSpecialtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSpecialtyId(e.target.value);
    setDoctorProfileId(null);
    setTime(null);
  };

  const handleConfirmUpdate = async () => {
    if (!appointmentId) return;

    if (!specialtyId || !doctorProfileId || !selectedDate || !time) {
      toast.error(
        "Por favor verifica que la especialidad, médico, fecha y hora estén seleccionados."
      );
      return;
    }

    setIsSubmitting(true);

    const updatePayload: UpdateAppointmentDTO = {
      doctorProfileId,
      specialtyId,
      appointmentDate: selectedDate.toISOString(),
      startTime: time,
      notes: notes.trim(),
    };

    try {
      await appointmentService.updateAppointment(appointmentId, updatePayload);

      try {
        window.dispatchEvent(new CustomEvent("notifications:refresh"));
      } catch (e) {}

      toast.success("Cita actualizada exitosamente");
      navigate(`/appointments/${appointmentId}`);
    } catch (error: any) {
      console.error("Error al actualizar:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al actualizar la cita";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedSpecialtyName = specialties.find(
    (s) => s.id === specialtyId
  )?.name;
  const selectedDoctor = doctors.find((d) => d.id === doctorProfileId);
  const selectedDoctorName = selectedDoctor
    ? `${selectedDoctor.user.firstName} ${selectedDoctor.user.lastName}`
    : null;

  if (isLoadingInitialData) {
    return (
      <div className="flex justify-center items-center h-64">
        Cargando información de la cita...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Volver"
        >
          <FaArrowLeft className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Cita</h1>
          <p className="text-gray-600">
            Modifica los detalles de tu cita programada.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <StepSelector
            icon={<FaStethoscope />}
            title="Especialidad"
            description="Puedes cambiar el tipo de consulta médica."
          >
            <select
              value={specialtyId || ""}
              onChange={handleSpecialtyChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white"
              disabled={isSubmitting}
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
            description="Selecciona el profesional para la nueva fecha/hora."
          >
            <select
              value={doctorProfileId || ""}
              onChange={(e) => setDoctorProfileId(e.target.value)}
              disabled={
                !specialtyId ||
                isSubmitting ||
                (doctors.length === 0 && !!specialtyId)
              }
              className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white disabled:bg-gray-100"
            >
              <option value="" disabled>
                {!specialtyId
                  ? "Primero selecciona una especialidad"
                  : doctors.length === 0
                  ? "No hay médicos disponibles"
                  : "Selecciona un médico"}
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
            description="Selecciona la nueva hora para tu cita."
          >
            {isLoadingSlots ? (
              <div className="flex items-center gap-2 text-sm text-medical-600 p-4 bg-medical-50 rounded-lg">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verificando disponibilidad...
              </div>
            ) : (
              <>
                {availableSlots.length > 0 && (
                  <TimeSlotPicker
                    slots={availableSlots}
                    selectedTime={time}
                    onTimeChange={setTime}
                  />
                )}

                {availableSlots.length === 0 &&
                  doctorProfileId &&
                  selectedDate && (
                    <p className="text-sm text-red-500 p-2 bg-red-50 rounded border border-red-100">
                      No hay horarios disponibles para el médico seleccionado en
                      esta fecha. Por favor elige otro día.
                    </p>
                  )}

                {!doctorProfileId && (
                  <p className="text-sm text-gray-500 italic">
                    Selecciona un médico y una fecha en el calendario para ver
                    los horarios disponibles.
                  </p>
                )}
              </>
            )}
          </StepSelector>

          <StepSelector
            icon={<FaStickyNote />}
            title="Notas Adicionales"
            description="Agrega información relevante para el médico (opcional)."
          >
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-y min-h-[100px]"
              placeholder="Ej: Motivo de la consulta, síntomas previos..."
              disabled={isSubmitting}
              maxLength={500}
            />
            <div className="text-xs text-gray-500 text-right mt-1">
              {notes.length}/500 caracteres
            </div>
          </StepSelector>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6 sticky top-6 h-fit">
          <Calendar
            selectedDate={selectedDate || new Date()}
            onDateChange={setSelectedDate}
          />

          <AppointmentSummary
            specialty={selectedSpecialtyName || "Pendiente"}
            doctor={selectedDoctorName || "Pendiente"}
            date={formatDateForDisplay(selectedDate) || "Pendiente"}
            time={time || "Pendiente"}
            onConfirm={handleConfirmUpdate}
          />
        </div>
      </div>
    </div>
  );
}
