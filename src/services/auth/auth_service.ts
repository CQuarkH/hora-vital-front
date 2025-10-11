import type {
  LoginCredentials,
  RegisterData,
  UpdateProfileData,
  AuthResponse,
  User,
  ServiceResponse,
} from '../auth_types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(credentials),
      });

      return this.handleResponse<AuthResponse['data']>(response);
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: 'Error de conexión con el servidor',
      };
    }
  }

  async register(userData: RegisterData): Promise<ServiceResponse<AuthResponse['data']>> {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(userData),
      });

      return this.handleResponse<AuthResponse['data']>(response);
    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        error: 'Error de conexión con el servidor',
      };
    }
  }

  async getMe(token: string): Promise<ServiceResponse<User>> {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: 'GET',
        headers: this.getHeaders(true, token),
      });

      return this.handleResponse<User>(response);
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return {
        success: false,
        error: 'Error de conexión con el servidor',
      };
    }
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
    try {
      const response = await this.getMe(token);
      return response.success;
    } catch {
      return false;
    }
  }
}

export const authService = new AuthService();