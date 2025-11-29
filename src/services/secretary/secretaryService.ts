const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export interface CreatePatientData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  rut: string;
  phone?: string;
  gender?: string;
  birthDate?: string;
  address?: string;
}

// Interfaces para CU-08 y CU-09
export interface DoctorInfo {
  id: string;
  name: string;
  specialty: string;
}

export interface Schedule {
  id: string;
  doctorProfileId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
  isActive: boolean;
}

export interface BlockedPeriod {
  id: string;
  doctorProfileId: string;
  startDateTime: string;
  endDateTime: string;
  reason?: string;
  isActive: boolean;
  createdBy: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorProfileId: string;
  specialtyId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string;
}

export interface DoctorAgenda {
  doctor: DoctorInfo;
  date: string;
  schedules: Schedule[];
  appointments: Appointment[];
  blockedPeriods: BlockedPeriod[];
}

export interface BlockPeriodData {
  doctorProfileId: string;
  startDateTime: string;
  endDateTime: string;
  reason?: string;
}

export class SecretaryService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  // CU-10: Registrar Paciente
  async createPatient(data: CreatePatientData) {
    const response = await fetch(`${API_URL}/api/secretary/patients`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al crear usuario");
    }
    return response.json();
  }

  // CU-08: Obtener agenda completa del profesional (usa endpoint existente)
  async getDoctorAgenda(
    doctorId: string,
    date?: string
  ): Promise<DoctorAgenda> {
    const params = new URLSearchParams();
    if (date) params.append("date", date);

    const response = await fetch(
      `${API_URL}/api/secretary/agenda/${doctorId}?${params.toString()}`,
      { headers: this.getHeaders() }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener agenda");
    }
    return response.json();
  }

  // CU-08: Modificar bloque horario existente (usa endpoint existente)
  async updateSchedule(scheduleId: string, data: Partial<Schedule>) {
    console.log("Updating schedule:", scheduleId, data);
    const response = await fetch(
      `${API_URL}/api/secretary/schedules/${scheduleId}`,
      {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      console.log("Error updating schedule:", error);
      throw new Error(error.message || "Error al actualizar horario");
    }
    return response.json();
  }

  // CU-08: Bloquear horarios específicos (usa endpoint existente)
  async blockPeriod(data: BlockPeriodData): Promise<BlockedPeriod> {
    data.endDateTime.lastIndexOf("Z") === -1 && (data.endDateTime += "Z");
    data.startDateTime.lastIndexOf("Z") === -1 && (data.startDateTime += "Z");

    const response = await fetch(`${API_URL}/api/secretary/blocks`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      console.log(error);
      throw new Error(error.message || "Error al bloquear período");
    }
    return response.json();
  }

  // CU-08: Desbloquear período específico (usa endpoint existente)
  async unblockPeriod(blockedPeriodId: string) {
    const response = await fetch(
      `${API_URL}/api/secretary/blocks/${blockedPeriodId}`,
      {
        method: "DELETE",
        headers: this.getHeaders(),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al desbloquear período");
    }
    return response.json();
  }

  // CU-08 FA-01: Bloquear con override - cancela citas existentes (usa endpoint existente)
  async blockPeriodWithOverride(
    data: BlockPeriodData
  ): Promise<{ blockedPeriod: BlockedPeriod; cancelledAppointments: number }> {
    data.endDateTime.lastIndexOf("Z") === -1 && (data.endDateTime += "Z");
    data.startDateTime.lastIndexOf("Z") === -1 && (data.startDateTime += "Z");
    const response = await fetch(`${API_URL}/api/secretary/blocks/override`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al bloquear período");
    }
    return response.json();
  }
}

export const secretaryService = new SecretaryService();
