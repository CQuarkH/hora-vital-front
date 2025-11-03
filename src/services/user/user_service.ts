import type { User, ServiceResponse } from '../../types/auth/auth_types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface UpdateProfilePayload {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
}

class UserService {
    private getHeaders(token: string): HeadersInit {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
    }

    private async handleResponse<T>(response: Response): Promise<ServiceResponse<T>> {
        try {
            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || data.error?.message || data.error || `Error: ${response.status}`,
                };
            }

            return {
                success: true,
                data: data.data || data,
            };
        } catch (error) {
            return {
                success: false,
                error: 'Error al procesar la respuesta del servidor',
            };
        }
    }

    /**
     * Obtener perfil del usuario autenticado
     */
    async getProfile(token: string): Promise<ServiceResponse<User>> {
        try {
            const response = await fetch(`${API_URL}/api/profile`, {
                method: 'GET',
                headers: this.getHeaders(token),
            });

            const result = await this.handleResponse<User>(response);

            // Transformar name a firstName/lastName si viene del backend
            if (result.success && result.data) {
                const userData = result.data as any;
                if (userData.name && !userData.firstName) {
                    const [firstName, ...lastNameParts] = userData.name.split(' ');
                    result.data = {
                        ...userData,
                        firstName: firstName || '',
                        lastName: lastNameParts.join(' ') || '',
                    };
                }
            }

            return result;
        } catch (error) {
            console.error('Error al obtener perfil:', error);
            return {
                success: false,
                error: 'Error de conexión con el servidor',
            };
        }
    }

    /**
     * Actualizar perfil del usuario autenticado
     */
    async updateProfile(
        token: string,
        profileData: UpdateProfilePayload
    ): Promise<ServiceResponse<User>> {
        try {
            const response = await fetch(`${API_URL}/api/users/profile`, {
                method: 'PUT',
                headers: this.getHeaders(token),
                body: JSON.stringify(profileData),
            });

            const result = await this.handleResponse<User>(response);
            return (result.data && Object.keys(result.data).length > 0) ? result : { success: false, error: (result.error || 'Error desconocido') };
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            return {
                success: false,
                error: 'Error de conexión con el servidor',
            };
        }
    }

    /**
     * Cambiar contraseña del usuario autenticado
     */
    async changePassword(
        token: string,
        currentPassword: string,
        newPassword: string
    ): Promise<ServiceResponse<{ message: string }>> {
        try {
            const response = await fetch(`${API_URL}/api/profile/change-password`, {
                method: 'PUT',
                headers: this.getHeaders(token),
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
}

export const userService = new UserService();