import React from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";
import type { AppointmentStatus } from "./AppointmentStatusBadge";

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  status: AppointmentStatus;
}

export const AppointmentListCard: React.FC<Appointment> = (appointment) => {
  const navigate = useNavigate();

  const [day, monthStr] = appointment.date.split("-").slice(0, 2);
  const monthMap: Record<string, string> = {
    "01": "ene",
    "02": "feb",
    "03": "mar",
    "04": "abr",
    "05": "may",
    "06": "jun",
    "07": "jul",
    "08": "ago",
    "09": "sep",
    "10": "oct",
    "11": "nov",
    "12": "dic",
  };
  const month = monthMap[monthStr] || "???";

  return (
    <div className="flex items-center gap-4 p-4 bg-medical-50 border border-medical-200 rounded-xl shadow-sm w-full">
      <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-white border border-gray-200">
        <span className="text-xl font-bold text-medical-800">{day}</span>
        <span className="text-sm font-medium text-medical-700 uppercase">
          {month}
        </span>
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-medical-900">
            {appointment.doctorName}
          </h3>
          <AppointmentStatusBadge status={appointment.status} />
        </div>
        <p className="text-sm text-gray-600">{appointment.specialty}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500 pt-1">
          <span className="flex items-center gap-1">
            <HiOutlineCalendar /> {appointment.date}
          </span>
          <span className="flex items-center gap-1">
            <HiOutlineClock /> {appointment.time}
          </span>
          <span className="flex items-center gap-1">
            <HiOutlineLocationMarker /> {appointment.location}
          </span>
        </div>
      </div>

      <div className="ml-4">
        <button
          onClick={() => navigate(`/appointments/${appointment.id}`)}
          className="text-sm font-medium text-medical-600 hover:text-medical-800"
        >
          Ver Detalles
        </button>
        <button
          onClick={() => navigate(`/appointments/edit/${appointment.id}`)}
          className="ml-4 text-sm font-medium text-medical-600 hover:text-medical-800"
        >
          Editar
        </button>
      </div>
    </div>
  );
};
