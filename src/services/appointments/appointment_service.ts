import { useAuth } from "../../context/AuthContext";
import {
  Specialty,
  Doctor,
  TimeSlot,
  CreateAppointmentData,
  Appointment,
} from "../../types/appointments/appointment_types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Definimos la interfaz para los datos de actualización para mantener el código limpio
export interface UpdateAppointmentData {
  doctorProfileId?: string;
  specialtyId?: string;
  appointmentDate?: string;
  startTime?: string;
  notes?: string;
}

class AppointmentService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async getSpecialties(): Promise<Specialty[]> {
    const response = await fetch(`${API_URL}/api/medical/specialties`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error("Error al obtener especialidades");
    return response.json();
  }

  async getDoctors(specialtyId?: string): Promise<Doctor[]> {
    const url = specialtyId
      ? `${API_URL}/api/medical/doctors?specialtyId=${specialtyId}`
      : `${API_URL}/api/medical/doctors`;
    const response = await fetch(url, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error("Error al obtener médicos");
    return response.json();
  }

  async getAvailability(
    date: Date,
    doctorProfileId?: string,
    specialtyId?: string
  ): Promise<TimeSlot[]> {
    const dateStr = date.toISOString().split("T")[0];
    const params = new URLSearchParams({ date: dateStr });
    if (doctorProfileId) params.append("doctorProfileId", doctorProfileId);
    if (specialtyId) params.append("specialtyId", specialtyId);

    const response = await fetch(
      `${API_URL}/api/appointments/availability?${params.toString()}`,
      {
        headers: this.getHeaders(),
      }
    );
    if (!response.ok) throw new Error("Error al obtener disponibilidad");
    const data = await response.json();
    return data.availableSlots;
  }

  async getAppointmentById(
    id: string,
    user?: { role: string }
  ): Promise<Appointment> {
    const role = user?.role;
    const allAppointments =
      (role && role === "secretary") || role === "admin"
        ? await this.getAppointmentsAsAdmin()
        : await this.getMyAppointments();
    console.log(`Total appointments fetched: ${allAppointments.length}`);
    const appointment = allAppointments.find((appt) => appt.id === id);
    if (!appointment) throw new Error("Cita no encontrada");
    return appointment;
  }
  // -----------------------------

  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    const response = await fetch(`${API_URL}/api/appointments`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear cita");
    }
    const result = await response.json();
    return result.appointment;
  }

  async getAppointmentsAsAdmin(
    patientName?: string,
    specialtyId?: string,
    status?: string
  ): Promise<Appointment[]> {
    const params = new URLSearchParams();
    if (patientName) params.append("patientName", patientName);
    if (specialtyId) params.append("specialtyId", specialtyId);

    if (status && status !== "Todos")
      params.append("status", status.toUpperCase());

    const response = await fetch(
      `${API_URL}/api/admin/appointments?${params.toString()}`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) throw new Error("Error al obtener citas");
    const data = await response.json();
    return data.appointments;
  }

  async getMyAppointments(status?: string): Promise<Appointment[]> {
    const params = new URLSearchParams();
    if (status && status !== "Todos")
      params.append("status", status.toUpperCase());

    const response = await fetch(
      `${API_URL}/api/appointments/my-appointments?${params.toString()}`,
      {
        headers: this.getHeaders(),
      }
    );
    if (!response.ok) throw new Error("Error al obtener mis citas");
    const data = await response.json();
    return data.appointments;
  }

  async cancelAppointment(id: string, reason: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/appointments/${id}/cancel`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify({ cancellationReason: reason }),
    });
    if (!response.ok) throw new Error("Error al cancelar cita");
  }

  async updateAppointment(
    id: string,
    data: UpdateAppointmentData // Usamos la interfaz definida arriba
  ): Promise<Appointment> {
    const response = await fetch(`${API_URL}/api/appointments/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar cita");
    }
    const result = await response.json();
    return result.appointment;
  }
}

export const appointmentService = new AppointmentService();
