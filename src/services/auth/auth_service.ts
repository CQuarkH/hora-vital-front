import type {
  LoginCredentials,
  RegisterData,
  UpdateProfileData,
  AuthResponse,
  User,
  ServiceResponse,
} from '../../types/auth/auth_types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const FAKE_TOKEN = 'fake-jwt-token-12345';

// 🔹 Utilidad para crear fechas ISO
const now = new Date().toISOString();

// 🔹 Simulamos algunos usuarios de prueba
const MOCK_USERS: Record<string, User> = {
  admin: {
    id: '1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    phone: '+56 9 1111 1111',
    rut: '11.111.111-1',
    role: 'admin',
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  patient: {
    id: '2',
    email: 'patient@example.com',
    firstName: 'Maria',
    lastName: 'Gonzalez',
    phone: '+56 9 2222 2222',
    rut: '22.222.222-2',
    role: 'patient',
    isActive: true,
    createdAt: now,
    birthDate: '1990-01-01',
    gender: 'Femenino',
    address: 'Calle Falsa 123, Ciudad, País',
    updatedAt: now,
  },
  secretary: {
    id: '3',
    email: 'secretary@example.com',
    firstName: 'Secretary',
    lastName: 'User',
    phone: '+56 9 3333 3333',
    rut: '33.333.333-3',
    role: 'secretary',
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
};

class AuthService {
  private getHeaders(includeAuth: boolean = false, token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ServiceResponse<T>> {
    try {
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error?.message || `Error: ${response.status}`,
        };
      }

      return {
        success: true,
        data: data.data,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al procesar la respuesta del servidor',
      };
    }
  }

  async login(credentials: LoginCredentials): Promise<ServiceResponse<AuthResponse['data']>> {
    try {
      // Simulamos un pequeño retraso de red
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Asignar rol según el RUT ingresado (solo para simular)
      let user: User = MOCK_USERS.patient;

      if (credentials.rut === '11.111.111-1') user = MOCK_USERS.admin;
      else if (credentials.rut === '33.333.333-3') user = MOCK_USERS.secretary;

      // Retornar respuesta exitosa
      return {
        success: true,
        data: {
          user,
          token: FAKE_TOKEN,
        },
      };
    } catch (error) {
      console.error('Error simulado en login:', error);
      return {
        success: false,
        error: 'Simulated login error',
      };
    }
  }

  async register(userData: RegisterData): Promise<ServiceResponse<AuthResponse['data']>> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newUser: User = {
        id: String(Date.now()),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        rut: userData.rut,
        role: 'patient', // Todos los registros nuevos son "patient"
        isActive: true,
        createdAt: now,
        updatedAt: now,
      };

      return {
        success: true,
        data: {
          user: newUser,
          token: FAKE_TOKEN,
        },
      };
    } catch (error) {
      console.error('Error simulado en registro:', error);
      return {
        success: false,
        error: 'Simulated register error',
      };
    }
  }

  async getMe(token: string): Promise<ServiceResponse<User>> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (token === FAKE_TOKEN) {
      return { success: true, data: MOCK_USERS.patient };
    }
    return { success: false, error: 'Invalid token' };
  }

  async updateProfile(
    token: string,
    profileData: UpdateProfileData
  ): Promise<ServiceResponse<User>> {
    try {
      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: this.getHeaders(true, token),
        body: JSON.stringify(profileData),
      });

      return this.handleResponse<User>(response);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return {
        success: false,
        error: 'Error de conexión con el servidor',
      };
    }
  }

  async changePassword(
    token: string,
    currentPassword: string,
    newPassword: string
  ): Promise<ServiceResponse<{ message: string }>> {
    try {
      const response = await fetch(`${API_URL}/api/users/change-password`, {
        method: 'PUT',
        headers: this.getHeaders(true, token),
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      return this.handleResponse<{ message: string }>(response);
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      return {
        success: false,
        error: 'Error de conexión con el servidor',
      };
    }
  }

  // Método para verificar si el token es válido
  async verifyToken(token: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return token === FAKE_TOKEN;
  }
}

export const authService = new AuthService();