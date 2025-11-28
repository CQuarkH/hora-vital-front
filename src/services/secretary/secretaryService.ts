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

export class SecretaryService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }
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
}

export const secretaryService = new SecretaryService();
