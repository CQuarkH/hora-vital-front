import React from "react";
import clsx from "clsx";
import type {
  Notification,
  NotificationType,
  NotificationPriority,
} from "../../types/notification/notification_types";

import {
  HiOutlineBell,
  HiOutlineCheckCircle,
  HiOutlineInformationCircle,
  HiOutlineCalendar,
  HiOutlineClipboardList,
  HiOutlineTrash,
} from "react-icons/hi";

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const iconMap: Record<NotificationType, React.ReactNode> = {
  reminder: <HiOutlineBell />,
  confirmation: <HiOutlineCheckCircle />,
  system: <HiOutlineInformationCircle />,
  rescheduled: <HiOutlineCalendar />,
  test_results: <HiOutlineClipboardList />,
  general: <HiOutlineBell />,
};

const priorityStyles: Record<NotificationPriority, string> = {
  Alta: "bg-red-100 text-red-800 border-red-300",
  Media: "bg-green-100 text-green-800 border-green-300",
  Baja: "bg-yellow-100 text-yellow-800 border-yellow-300",
};

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
}) => {
  const { id, type, title, message, timestamp, priority, isRead, data } =
    notification;

  const specialty = data.specialty ? ` - ${data.specialty}` : "";

  return (
    <div
      data-testid="notification-card"
      className={clsx(
        "flex items-start gap-4 p-5 rounded-xl border w-full",
        isRead ? "bg-white border-gray-200" : "bg-medical-50 border-medical-200"
      )}
    >
      <div className="text-2xl text-medical-700 mt-1">
        {iconMap[type] || <HiOutlineBell />}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-gray-900">
            {title} {specialty}
          </h4>
          {!isRead && (
            <span
              className="h-2 w-2 bg-green-500 rounded-full"
              title="No leído"
            ></span>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">{message}</p>
        <p className="text-xs text-gray-400 mt-2">
          {new Date(timestamp).toLocaleString("es-CL")}
        </p>
      </div>

      <div className="flex flex-col items-end justify-between h-full space-y-2">
        <span
          className={clsx(
            "text-xs font-semibold px-2.5 py-0.5 rounded-full border",
            priorityStyles[priority]
          )}
        >
          {priority}
        </span>

        <div className="flex items-center gap-4 mt-auto">
          {!isRead && (
            <button
              onClick={() => onMarkAsRead(id)}
              className="text-xs font-medium text-medical-600 hover:text-medical-800"
            >
              Marcar como Leída
            </button>
          )}
          <button
            onClick={() => onDelete(id)}
            className="text-gray-400 hover:text-red-500"
            title="Eliminar"
          >
            <HiOutlineTrash className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
