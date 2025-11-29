import React from "react";
import { AppointmentStatusBadge } from "../appointments/AppointmentStatusBadge";
import type { AppointmentStatus } from "../appointments/AppointmentStatusBadge";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";

export interface AdminAppointment {
  id: string;
  patientName: string;
  rut: string;
  doctorName: string;
  date: string;
  time: string;
  status: AppointmentStatus;
}

interface AdminAppointmentRowProps {
  appointment: AdminAppointment;
  onEdit: (id: string) => void;
  onCancel: (id: string) => void;
  onView: (id: string) => void;
}

export const AdminAppointmentTableRow: React.FC<AdminAppointmentRowProps> = ({
  appointment,
  onEdit,
  onCancel,
  onView,
}) => {
  return (
    <div className="grid grid-cols-6 gap-4 items-center p-4 border-b border-gray-200 hover:bg-gray-50">
      <div className="col-span-1">
        <p className="font-semibold text-gray-900">{appointment.patientName}</p>
        <p className="text-sm text-gray-500">RUT: {appointment.rut}</p>
      </div>

      <div className="col-span-1 text-sm text-gray-600">
        {appointment.doctorName}
      </div>

      <div className="col-span-1 text-sm text-gray-600">
        {new Date(appointment.date).toLocaleDateString("es-CL", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </div>

      <div className="col-span-1 text-sm text-gray-600">{appointment.time}</div>

      <div className="col-span-1">
        <AppointmentStatusBadge status={appointment.status} />
      </div>

      <div className="col-span-1 flex justify-end items-center gap-4">
        <button
          onClick={() => onView(appointment.id)}
          className="text-gray-500 hover:text-medical-700"
          title="Ver Detalle"
        >
          <HiOutlineEye className="h-5 w-5" />
        </button>
        <button
          onClick={() => onEdit(appointment.id)}
          className="text-gray-500 hover:text-medical-700"
          title="Editar Cita"
        >
          <HiOutlinePencil className="h-5 w-5" />
        </button>
        <button
          onClick={() => onCancel(appointment.id)}
          className="text-gray-500 hover:text-red-600"
          title="Cancelar Cita"
        >
          <HiOutlineTrash className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
