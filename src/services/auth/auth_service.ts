import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  ServiceResponse,
} from '../../types/auth/auth_types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class AuthService {
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse<T>(response: Response): Promise<ServiceResponse<T>> {
    try {
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || `Error: ${response.status}`,
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

  /**
   * Transformar respuesta del backend a formato del frontend
   * Backend: { id, name, email, role }
   * Frontend: { id, firstName, lastName, email, role, ... }
   */
  private transformUserFromBackend(backendUser: any): User {
    return {
      id: backendUser.id,
      email: backendUser.email,
      firstName: backendUser.firstName,
      lastName: backendUser.lastName,
      phone: backendUser.phone || '',
      rut: backendUser.rut || '',
      role: backendUser.role,
      isActive: backendUser.isActive ?? true,
      createdAt: backendUser.createdAt || new Date().toISOString(),
      updatedAt: backendUser.updatedAt || new Date().toISOString(),
      birthDate: backendUser.birthDate,
      gender: backendUser.gender,
      address: backendUser.address,
    };
  }

  /**
   * Login con RUT y contraseña
   */
  async login(credentials: LoginCredentials): Promise<ServiceResponse<AuthResponse['data']>> {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          rut: credentials.rut,
          password: credentials.password,
        }),
      });

      const result = await this.handleResponse<{ token: string; user: any }>(response);

      if (!result.success || !result.data) {
        return {
          success: false,
          error: result.error || 'Error al iniciar sesión',
        };
      }
      const transformedUser = this.transformUserFromBackend(result.data.user);

      return {
        success: true,
        data: {
          user: transformedUser,
          token: result.data.token,
        },
      };
    } catch (error: any) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: error.message || 'Error de conexión con el servidor',
      };
    }
  }

  /**
   * Registro de nuevo usuario
   */
  async register(userData: RegisterData): Promise<ServiceResponse<AuthResponse['data']>> {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(userData),
      });

      const result = await this.handleResponse<{ token: string; user: any }>(response);

      if (!result.success || !result.data) {
        return {
          success: false,
          error: result.error || 'Error al registrar usuario',
        };
      }


      const transformedUser = this.transformUserFromBackend(result.data.user);

      return {
        success: true,
        data: {
          user: transformedUser,
          token: result.data.token,
        },
      };
    } catch (error: any) {
      console.error('Error en registro:', error);
      return {
        success: false,
        error: error.message || 'Error de conexión con el servidor',
      };
    }
  }

  /**
   * Verificar si el token es válido
   * Nota: Esto debería hacerse en el backend, pero por ahora solo verificamos que exista
   */
  async verifyToken(token: string): Promise<boolean> {
    if (!token) return false;

    try {
      // Intentar obtener el perfil con el token
      const response = await fetch(`${API_URL}/api/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error al verificar token:', error);
      return false;
    }
  }
}

export const authService = new AuthService();