import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineSave,
  HiOutlineCalendar,
  HiOutlineBan,
  HiOutlineX,
  HiOutlineExclamationCircle,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi";
import { SchedulePreviewModal } from "../../components/schedule/SchedulePreviewModal";
import { appointmentService } from "../../services/appointments/appointment_service";
import { secretaryService } from "../../services/secretary/secretaryService";
import type { Doctor } from "../../types/appointments/appointment_types";
import type {
  DoctorAgenda,
  BlockPeriodData,
} from "../../services/secretary/secretaryService";

const DAY_NAMES = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

interface BlockModalState {
  isOpen: boolean;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  reason: string;
  hasConflictError: boolean;
}

interface DayScheduleEdit {
  startTime: string;
  endTime: string;
  slotDuration: number;
  isActive: boolean;
}

export default function ScheduleManagementPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [agenda, setAgenda] = useState<DoctorAgenda | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Estado para editar el horario del día seleccionado
  const [dayScheduleEdit, setDayScheduleEdit] =
    useState<DayScheduleEdit | null>(null);

  // Estado del modal de bloqueo
  const [blockModal, setBlockModal] = useState<BlockModalState>({
    isOpen: false,
    startDate: "",
    startTime: "09:00",
    endDate: "",
    endTime: "17:00",
    reason: "",
    hasConflictError: false,
  });

  // Cargar doctores al montar
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const data = await appointmentService.getDoctors();
        setDoctors(data);
        if (data.length > 0) {
          setSelectedDoctor(data[0].id);
        }
      } catch (err) {
        console.error("Error loading doctors:", err);
        toast.error("Error al cargar médicos");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Cargar agenda cuando cambia doctor o fecha
  useEffect(() => {
    if (!selectedDoctor) return;

    const fetchAgenda = async () => {
      try {
        const agendaResponse = await secretaryService.getDoctorAgenda(
          selectedDoctor,
          selectedDate
        );
        setAgenda(agendaResponse);

        // Si hay un schedule para este día, cargarlo para edición
        if (agendaResponse.schedules.length > 0) {
          const schedule = agendaResponse.schedules[0];
          setDayScheduleEdit({
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            slotDuration: schedule.slotDuration,
            isActive: schedule.isActive,
          });
        } else {
          setDayScheduleEdit(null);
        }
      } catch (err) {
        console.error("Error loading agenda:", err);
        setAgenda(null);
        setDayScheduleEdit(null);
      }
    };
    fetchAgenda();
  }, [selectedDoctor, selectedDate]);

  // Obtener nombre del día seleccionado
  const getSelectedDayName = () => {
    const date = new Date(selectedDate + "T12:00:00");
    return DAY_NAMES[date.getDay()];
  };

  // Formatear fecha para mostrar
  const formatDisplayDate = () => {
    const date = new Date(selectedDate + "T12:00:00");
    return date.toLocaleDateString("es-CL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Navegar fechas
  const navigateDate = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split("T")[0]);
  };

  // Guardar cambios del horario del día
  const handleSaveChanges = async () => {
    if (!selectedDoctor || !agenda || !dayScheduleEdit) return;

    if (agenda.schedules.length === 0) {
      toast.error("No hay horarios configurados para este día");
      return;
    }

    setIsSaving(true);
    try {
      const schedule = agenda.schedules[0];
      await secretaryService.updateSchedule(schedule.id, {
        startTime: dayScheduleEdit.startTime,
        endTime: dayScheduleEdit.endTime,
        slotDuration: dayScheduleEdit.slotDuration,
        isActive: dayScheduleEdit.isActive,
        dayOfWeek: new Date(selectedDate).getDay(),
      });

      toast.success("¡Horario actualizado exitosamente!");

      // Recargar agenda
      const agendaResponse = await secretaryService.getDoctorAgenda(
        selectedDoctor,
        selectedDate
      );
      setAgenda(agendaResponse);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      toast.error("Error al guardar: " + errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  // Abrir modal de bloqueo con fecha preseleccionada
  const openBlockModal = () => {
    setBlockModal({
      isOpen: true,
      startDate: selectedDate,
      startTime: "09:00",
      endDate: selectedDate,
      endTime: "17:00",
      reason: "",
      hasConflictError: false,
    });
  };

  // Intentar bloquear sin cancelar citas
  const handleBlockPeriod = async () => {
    if (!selectedDoctor) return;

    const blockData: BlockPeriodData = {
      doctorProfileId: selectedDoctor,
      startDateTime: `${blockModal.startDate}T${blockModal.startTime}:00`,
      endDateTime: `${blockModal.endDate}T${blockModal.endTime}:00`,
      reason: blockModal.reason || undefined,
    };

    try {
      await secretaryService.blockPeriod(blockData);
      toast.success("Horario bloqueado exitosamente");

      // Recargar agenda
      const agendaResponse = await secretaryService.getDoctorAgenda(
        selectedDoctor,
        selectedDate
      );
      setAgenda(agendaResponse);

      setBlockModal({
        isOpen: false,
        startDate: "",
        startTime: "09:00",
        endDate: "",
        endTime: "17:00",
        reason: "",
        hasConflictError: false,
      });
    } catch (err: unknown) {
      const error = err as { message?: string };
      if (
        error.message?.includes("citas programadas") ||
        error.message?.includes("409")
      ) {
        setBlockModal((prev) => ({ ...prev, hasConflictError: true }));
      } else {
        toast.error(error.message || "Error al bloquear horario");
      }
    }
  };

  // Bloquear con override (cancela citas) - FA-01
  const handleBlockWithOverride = async () => {
    if (!selectedDoctor) return;

    const blockData: BlockPeriodData = {
      doctorProfileId: selectedDoctor,
      startDateTime: `${blockModal.startDate}T${blockModal.startTime}:00`,
      endDateTime: `${blockModal.endDate}T${blockModal.endTime}:00`,
      reason: blockModal.reason || undefined,
    };

    try {
      const result = await secretaryService.blockPeriodWithOverride(blockData);
      toast.success(
        `Horario bloqueado. ${result.cancelledAppointments} cita(s) cancelada(s).`
      );

      // Recargar agenda
      const agendaResponse = await secretaryService.getDoctorAgenda(
        selectedDoctor,
        selectedDate
      );
      setAgenda(agendaResponse);

      setBlockModal({
        isOpen: false,
        startDate: "",
        startTime: "09:00",
        endDate: "",
        endTime: "17:00",
        reason: "",
        hasConflictError: false,
      });
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Error al bloquear horario");
    }
  };

  // Desbloquear período
  const handleUnblock = async (blockedPeriodId: string) => {
    try {
      await secretaryService.unblockPeriod(blockedPeriodId);
      toast.success("Período desbloqueado exitosamente");

      // Recargar agenda
      const agendaResponse = await secretaryService.getDoctorAgenda(
        selectedDoctor,
        selectedDate
      );
      setAgenda(agendaResponse);
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Error al desbloquear");
    }
  };

  const selectedDoctorData = doctors.find((d) => d.id === selectedDoctor);
  const selectedDoctorName = selectedDoctorData
    ? `Dr. ${selectedDoctorData.user.firstName} ${selectedDoctorData.user.lastName}`
    : "Doctor";
  const selectedSpecialty = selectedDoctorData?.specialty.name || "";

  // Datos para el modal de preview (formato esperado por SchedulePreviewModal)
  const getPreviewScheduleData = () => {
    const defaultSchedule = {
      isActive: false,
      startTime: "08:00",
      endTime: "17:00",
      breakTime: "",
      slotDuration: 30,
    };

    const scheduleData: Record<string, typeof defaultSchedule> = {};
    DAY_NAMES.forEach((day) => {
      scheduleData[day] = { ...defaultSchedule };
    });

    if (dayScheduleEdit) {
      const dayName = getSelectedDayName();
      scheduleData[dayName] = {
        isActive: dayScheduleEdit.isActive,
        startTime: dayScheduleEdit.startTime,
        endTime: dayScheduleEdit.endTime,
        breakTime: "",
        slotDuration: dayScheduleEdit.slotDuration,
      };
    }

    return scheduleData;
  };

  return (
    <>
      <div
        className="flex flex-col gap-6"
        data-testid="schedule-management-page"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestión de Agenda
            </h1>
            <p className="text-gray-600">
              Administra la disponibilidad horaria de los profesionales médicos
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsPreviewModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-medical-600 text-medical-600 rounded-lg font-medium hover:bg-medical-50"
              data-testid="preview-calendar-btn"
            >
              <HiOutlineCalendar className="h-5 w-5" />
              Ver Calendario
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={isSaving || !selectedDoctor || !dayScheduleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-medical-700 text-white rounded-lg font-medium hover:bg-medical-800 disabled:bg-gray-400"
              data-testid="save-schedule-btn"
            >
              <HiOutlineSave className="h-5 w-5" />
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </div>

        {/* Selector de médico */}
        <div className="p-4 bg-medical-50 border border-medical-200 rounded-xl">
          <label className="text-sm font-semibold text-medical-900">
            Seleccionar Profesional Médico
          </label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
            disabled={loading || doctors.length === 0}
            data-testid="doctor-selector"
          >
            {loading ? (
              <option>Cargando médicos...</option>
            ) : doctors.length === 0 ? (
              <option>No hay médicos disponibles</option>
            ) : (
              doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  Dr. {doc.user.firstName} {doc.user.lastName} -{" "}
                  {doc.specialty.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Navegación de fecha - CU-09 */}
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
          <button
            onClick={() => navigateDate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            data-testid="prev-date-btn"
          >
            <HiOutlineChevronLeft className="h-6 w-6 text-gray-600" />
          </button>

          <div className="flex items-center gap-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg"
              data-testid="date-selector"
            />
            <span className="text-lg font-medium text-gray-700 capitalize">
              {formatDisplayDate()}
            </span>
          </div>

          <button
            onClick={() => navigateDate(1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            data-testid="next-date-btn"
          >
            <HiOutlineChevronRight className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Resumen de la agenda del día - CU-09 */}
        {agenda && (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            data-testid="agenda-summary"
          >
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="text-2xl font-bold text-blue-700">
                {agenda.appointments.length}
              </div>
              <div className="text-sm text-blue-600">Citas programadas</div>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="text-2xl font-bold text-red-700">
                {agenda.blockedPeriods.length}
              </div>
              <div className="text-sm text-red-600">Períodos bloqueados</div>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="text-2xl font-bold text-green-700">
                {agenda.schedules.length > 0 && agenda.schedules[0].isActive
                  ? "Activo"
                  : "Inactivo"}
              </div>
              <div className="text-sm text-green-600">Estado del día</div>
            </div>
          </div>
        )}

        {/* Horario del día seleccionado - CU-08 */}
        <div className="p-4 bg-white border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Horario de {getSelectedDayName()} - {selectedDoctorName}
            </h3>
            {selectedSpecialty && (
              <span className="text-sm text-gray-500">{selectedSpecialty}</span>
            )}
          </div>

          {dayScheduleEdit ? (
            <div
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
              data-testid="day-schedule-edit"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora Inicio
                </label>
                <input
                  type="time"
                  value={dayScheduleEdit.startTime}
                  onChange={(e) =>
                    setDayScheduleEdit((prev) =>
                      prev ? { ...prev, startTime: e.target.value } : null
                    )
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  data-testid="schedule-start-time"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora Fin
                </label>
                <input
                  type="time"
                  value={dayScheduleEdit.endTime}
                  onChange={(e) =>
                    setDayScheduleEdit((prev) =>
                      prev ? { ...prev, endTime: e.target.value } : null
                    )
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  data-testid="schedule-end-time"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duración Cita (min)
                </label>
                <select
                  value={dayScheduleEdit.slotDuration}
                  onChange={(e) =>
                    setDayScheduleEdit((prev) =>
                      prev
                        ? { ...prev, slotDuration: Number(e.target.value) }
                        : null
                    )
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  data-testid="schedule-slot-duration"
                >
                  <option value={15}>15 minutos</option>
                  <option value={20}>20 minutos</option>
                  <option value={30}>30 minutos</option>
                  <option value={45}>45 minutos</option>
                  <option value={60}>60 minutos</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <button
                  onClick={() =>
                    setDayScheduleEdit((prev) =>
                      prev ? { ...prev, isActive: !prev.isActive } : null
                    )
                  }
                  className={`w-full p-2 rounded-lg font-medium ${
                    dayScheduleEdit.isActive
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-gray-100 text-gray-600 border border-gray-300"
                  }`}
                  data-testid="schedule-toggle-active"
                >
                  {dayScheduleEdit.isActive ? "Disponible" : "No Disponible"}
                </button>
              </div>
            </div>
          ) : (
            <div
              className="text-center py-8 text-gray-500"
              data-testid="no-schedule-message"
            >
              <p>No hay horarios configurados para este día.</p>
              <p className="text-sm mt-1">
                Contacte al administrador para configurar la disponibilidad.
              </p>
            </div>
          )}
        </div>

        {/* Citas del día - CU-09 */}
        <div
          className="p-4 bg-white border border-gray-200 rounded-xl"
          data-testid="appointments-list"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Citas Agendadas
          </h3>
          {agenda && agenda.appointments.length > 0 ? (
            <div className="space-y-2">
              {agenda.appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                  data-testid={`appointment-${apt.id}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="font-medium text-blue-800">
                      {apt.startTime} - {apt.endTime}
                    </div>
                    {apt.notes && (
                      <div className="text-sm text-blue-600">{apt.notes}</div>
                    )}
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded font-medium ${
                      apt.status === "SCHEDULED"
                        ? "bg-green-100 text-green-700"
                        : apt.status === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : apt.status === "COMPLETED"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {apt.status === "SCHEDULED"
                      ? "Programada"
                      : apt.status === "CANCELLED"
                      ? "Cancelada"
                      : apt.status === "COMPLETED"
                      ? "Completada"
                      : apt.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No hay citas agendadas para este día.
            </p>
          )}
        </div>

        {/* Períodos bloqueados - CU-08 */}
        <div
          className="p-4 bg-white border border-gray-200 rounded-xl"
          data-testid="blocked-periods-list"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Horarios Bloqueados
            </h3>
            <button
              onClick={openBlockModal}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              data-testid="open-block-modal-btn"
            >
              <HiOutlineBan className="h-4 w-4" />
              Bloquear Horario
            </button>
          </div>

          {agenda && agenda.blockedPeriods.length > 0 ? (
            <div className="space-y-2">
              {agenda.blockedPeriods.map((block) => (
                <div
                  key={block.id}
                  className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                  data-testid={`blocked-period-${block.id}`}
                >
                  <div>
                    <div className="font-medium text-red-800">
                      {new Date(block.startDateTime).toLocaleTimeString(
                        "es-CL",
                        { hour: "2-digit", minute: "2-digit" }
                      )}{" "}
                      -{" "}
                      {new Date(block.endDateTime).toLocaleTimeString("es-CL", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    {block.reason && (
                      <div className="text-sm text-red-600">
                        Motivo: {block.reason}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleUnblock(block.id)}
                    className="px-3 py-1 text-sm bg-white text-red-700 border border-red-300 rounded hover:bg-red-100"
                    data-testid={`unblock-btn-${block.id}`}
                  >
                    Desbloquear
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No hay horarios bloqueados para este día.
            </p>
          )}
        </div>
      </div>

      {/* Modal de Vista Previa del Calendario - CU-09 */}
      {isPreviewModalOpen && (
        <SchedulePreviewModal
          scheduleData={getPreviewScheduleData()}
          onClose={() => setIsPreviewModalOpen(false)}
        />
      )}

      {/* Modal de Bloqueo de Horario - CU-08 */}
      {blockModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            data-testid="block-modal"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Bloquear Horario
              </h3>
              <button
                onClick={() =>
                  setBlockModal((prev) => ({
                    ...prev,
                    isOpen: false,
                    hasConflictError: false,
                  }))
                }
                className="p-2 hover:bg-gray-100 rounded-lg"
                data-testid="close-block-modal-btn"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    value={blockModal.startDate}
                    onChange={(e) =>
                      setBlockModal((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                        hasConflictError: false,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    data-testid="block-start-date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora Inicio
                  </label>
                  <input
                    type="time"
                    value={blockModal.startTime}
                    onChange={(e) =>
                      setBlockModal((prev) => ({
                        ...prev,
                        startTime: e.target.value,
                        hasConflictError: false,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    data-testid="block-start-time"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    value={blockModal.endDate}
                    onChange={(e) =>
                      setBlockModal((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                        hasConflictError: false,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    data-testid="block-end-date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora Fin
                  </label>
                  <input
                    type="time"
                    value={blockModal.endTime}
                    onChange={(e) =>
                      setBlockModal((prev) => ({
                        ...prev,
                        endTime: e.target.value,
                        hasConflictError: false,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    data-testid="block-end-time"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo (opcional)
                </label>
                <input
                  type="text"
                  value={blockModal.reason}
                  onChange={(e) =>
                    setBlockModal((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  placeholder="Ej: Vacaciones, Reunión, Capacitación..."
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  data-testid="block-reason"
                />
              </div>

              {/* Advertencia de conflicto - FA-01 */}
              {blockModal.hasConflictError && (
                <div
                  className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                  data-testid="conflicts-warning"
                >
                  <div className="flex items-center gap-2 text-yellow-800 font-medium mb-2">
                    <HiOutlineExclamationCircle className="h-5 w-5" />
                    Hay citas programadas en este período
                  </div>
                  <p className="text-sm text-yellow-700">
                    ¿Desea bloquear el horario y cancelar las citas existentes?
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                {!blockModal.hasConflictError ? (
                  <button
                    onClick={handleBlockPeriod}
                    className="flex-1 py-2 px-4 bg-medical-600 text-white rounded-lg font-medium hover:bg-medical-700"
                    data-testid="confirm-block-btn"
                  >
                    Bloquear Horario
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        setBlockModal((prev) => ({
                          ...prev,
                          hasConflictError: false,
                        }))
                      }
                      className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                      data-testid="cancel-block-btn"
                    >
                      Volver
                    </button>
                    <button
                      onClick={handleBlockWithOverride}
                      className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                      data-testid="confirm-block-override-btn"
                    >
                      Bloquear y Cancelar Citas
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
