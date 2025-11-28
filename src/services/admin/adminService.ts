const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  rut: string;
  role?: "PATIENT" | "SECRETARY" | "ADMIN" | "DOCTOR";
  phone?: string;
  gender?: string;
  birthDate?: string;
  address?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  rut: string;
  phone: string;
  role: "PATIENT" | "SECRETARY" | "ADMIN" | "DOCTOR";
  isActive: boolean;
  gender?: string;
  birthDate?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface AppointmentFilters {
  page?: number;
  limit?: number;
  date?: string;
  status?: string;
  patientName?: string;
  doctorName?: string;
  specialtyId?: string;
}

export interface CreateScheduleData {
  doctorProfileId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration?: number;
}

class AdminService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  // Usuarios
  async getUsers(params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const response = await fetch(
      `${API_URL}/api/admin/users?${searchParams.toString()}`,
      { headers: this.getHeaders() }
    );
    if (!response.ok) throw new Error("Error al obtener usuarios");
    return response.json();
  }

  async createUser(data: CreateUserData) {
    const response = await fetch(`${API_URL}/api/admin/users`, {
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

  async updateUser(id: string, data: Partial<User>) {
    const response = await fetch(`${API_URL}/api/admin/users/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al actualizar usuario");
    return response.json();
  }

  async setUserStatus(id: string, isActive: boolean) {
    const response = await fetch(`${API_URL}/api/admin/users/${id}/status`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify({ isActive }),
    });
    if (!response.ok) throw new Error("Error al cambiar estado");
    return response.json();
  }

  // Pacientes
  async getPatients(params?: {
    page?: number;
    limit?: number;
    name?: string;
    rut?: string;
    status?: boolean;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.name) searchParams.append("name", params.name);
    if (params?.rut) searchParams.append("rut", params.rut);
    if (params?.status !== undefined)
      searchParams.append("status", params.status.toString());

    const response = await fetch(
      `${API_URL}/api/admin/patients?${searchParams.toString()}`,
      { headers: this.getHeaders() }
    );
    if (!response.ok) throw new Error("Error al obtener pacientes");
    return response.json();
  }

  // Citas
  async getAppointments(params?: AppointmentFilters) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.date) searchParams.append("date", params.date);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.patientName)
      searchParams.append("patientName", params.patientName);
    if (params?.doctorName)
      searchParams.append("doctorName", params.doctorName);
    if (params?.specialtyId)
      searchParams.append("specialtyId", params.specialtyId);

    const response = await fetch(
      `${API_URL}/api/admin/appointments?${searchParams.toString()}`,
      { headers: this.getHeaders() }
    );
    if (!response.ok) throw new Error("Error al obtener citas");
    return response.json();
  }

  // Calendario
  async getCalendarAvailability(
    startDate: string,
    endDate: string,
    doctorProfileId?: string,
    specialtyId?: string
  ) {
    const searchParams = new URLSearchParams();
    searchParams.append("startDate", startDate);
    searchParams.append("endDate", endDate);
    if (doctorProfileId)
      searchParams.append("doctorProfileId", doctorProfileId);
    if (specialtyId) searchParams.append("specialtyId", specialtyId);

    const response = await fetch(
      `${API_URL}/api/calendar/availability?${searchParams.toString()}`,
      { headers: this.getHeaders() }
    );
    if (!response.ok) throw new Error("Error al obtener calendario");
    return response.json();
  }

  // Horarios
  async createSchedule(data: CreateScheduleData) {
    const response = await fetch(`${API_URL}/api/admin/schedules`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al crear horario");
    }
    return response.json();
  }

  // MOCK - Endpoint no existe en backend
  async getSchedules(doctorProfileId: string) {
    console.warn(
      "getSchedules: Endpoint no implementado en backend, usando mock"
    );
    return {
      doctorProfileId,
      schedules: [
        {
          id: "1",
          dayOfWeek: 1,
          startTime: "09:00",
          endTime: "18:00",
          slotDuration: 30,
          isActive: true,
        },
        {
          id: "2",
          dayOfWeek: 2,
          startTime: "09:00",
          endTime: "18:00",
          slotDuration: 30,
          isActive: true,
        },
        {
          id: "3",
          dayOfWeek: 3,
          startTime: "09:00",
          endTime: "14:00",
          slotDuration: 30,
          isActive: true,
        },
        {
          id: "4",
          dayOfWeek: 4,
          startTime: "09:00",
          endTime: "18:00",
          slotDuration: 30,
          isActive: true,
        },
        {
          id: "5",
          dayOfWeek: 5,
          startTime: "09:00",
          endTime: "14:00",
          slotDuration: 30,
          isActive: true,
        },
      ],
    };
  }

  // MOCK - Endpoint no existe en backend
  async updateSchedules(doctorProfileId: string, schedules: any[]) {
    console.warn(
      "updateSchedules: Endpoint no implementado en backend, cambios solo locales"
    );
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, doctorProfileId, schedules };
  }

  // MOCK - El backend solo permite crear citas para el usuario autenticado
  // Se necesita un endpoint POST /api/admin/appointments con campo patientId
  async createAppointmentForPatient(data: {
    patientId: string;
    doctorProfileId: string;
    specialtyId: string;
    appointmentDate: string;
    startTime: string;
    notes?: string;
  }) {
    console.warn(
      "createAppointmentForPatient: Endpoint no implementado en backend. " +
        "Se requiere POST /api/admin/appointments con campo patientId"
    );
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      message: "Cita creada (simulación local)",
      appointment: {
        id: `mock-${Date.now()}`,
        ...data,
        status: "SCHEDULED",
      },
    };
  }
}

export const adminService = new AdminService();
