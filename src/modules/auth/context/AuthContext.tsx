import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { authService } from '../services/auth_service';
import type {
    User,
    LoginCredentials,
    RegisterData,
    UpdateProfileData,
    ServiceResponse,
} from '../auth_types';

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<ServiceResponse<{ user: User; token: string }>>;
    register: (userData: RegisterData) => Promise<ServiceResponse<{ user: User; token: string }>>;
    logout: () => void;
    updateProfile: (profileData: UpdateProfileData) => Promise<ServiceResponse<User>>;
    refreshUser: () => Promise<ServiceResponse<User>>;
    isAuthenticated: () => boolean;
    hasRole: (role: User['role']) => boolean;
    hasAnyRole: (roles: User['role'][]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Hook personalizado para usar el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Cargar usuario desde localStorage al iniciar
    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                try {
                    // Verificar que el token sigue siendo válido
                    const isValid = await authService.verifyToken(storedToken);

                    if (isValid) {
                        setToken(storedToken);
                        setUser(JSON.parse(storedUser));
                    } else {
                        // Token inválido, limpiar localStorage
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                    }
                } catch (error) {
                    console.error('Error al verificar token:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    // Función de login
    const login = async (credentials: LoginCredentials): Promise<ServiceResponse<{ user: User; token: string }>> => {
        try {
            setLoading(true);

            const response = await authService.login(credentials);

            if (!response.success || !response.data) {
                return {
                    success: false,
                    error: response.error || 'Error al iniciar sesión',
                };
            }

            const { token: authToken, user: userData } = response.data;

            localStorage.setItem('token', authToken);
            localStorage.setItem('user', JSON.stringify(userData));

            setToken(authToken);
            setUser(userData);

            return {
                success: true,
                data: { user: userData, token: authToken },
            };
        } catch (error: any) {
            console.error('Error en login:', error);
            return {
                success: false,
                error: error.message || 'Error inesperado',
            };
        } finally {
            setLoading(false);
        }
    };

    // Función de registro
    const register = async (userData: RegisterData): Promise<ServiceResponse<{ user: User; token: string }>> => {
        try {
            setLoading(true);

            const response = await authService.register(userData);

            if (!response.success || !response.data) {
                return {
                    success: false,
                    error: response.error || 'Error al registrar usuario',
                };
            }

            const { token: authToken, user: registeredUser } = response.data;

            localStorage.setItem('token', authToken);
            localStorage.setItem('user', JSON.stringify(registeredUser));

            setToken(authToken);
            setUser(registeredUser);

            return {
                success: true,
                data: { user: registeredUser, token: authToken },
            };
        } catch (error: any) {
            console.error('Error en registro:', error);
            return {
                success: false,
                error: error.message || 'Error inesperado',
            };
        } finally {
            setLoading(false);
        }
    };

    // Función de logout
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    // Función para actualizar perfil
    const updateProfile = async (profileData: UpdateProfileData): Promise<ServiceResponse<User>> => {
        try {
            if (!token) {
                return {
                    success: false,
                    error: 'No hay sesión activa',
                };
            }

            setLoading(true);

            const response = await authService.updateProfile(token, profileData);

            if (!response.success || !response.data) {
                return {
                    success: false,
                    error: response.error || 'Error al actualizar perfil',
                };
            }

            const updatedUser = response.data;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            return {
                success: true,
                data: updatedUser,
            };
        } catch (error: any) {
            console.error('Error al actualizar perfil:', error);
            return {
                success: false,
                error: error.message || 'Error inesperado',
            };
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener datos actualizados del usuario
    const refreshUser = async (): Promise<ServiceResponse<User>> => {
        try {
            if (!token) {
                return {
                    success: false,
                    error: 'No hay sesión activa',
                };
            }

            const response = await authService.getMe(token);

            if (!response.success || !response.data) {
                // Si el token es inválido, cerrar sesión
                if (response.error?.includes('401') || response.error?.includes('token')) {
                    logout();
                }
                return {
                    success: false,
                    error: response.error || 'Error al obtener usuario',
                };
            }

            const updatedUser = response.data;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            return {
                success: true,
                data: updatedUser,
            };
        } catch (error: any) {
            console.error('Error al refrescar usuario:', error);
            return {
                success: false,
                error: error.message || 'Error inesperado',
            };
        }
    };

    // Verificar si el usuario está autenticado
    const isAuthenticated = (): boolean => {
        return !!token && !!user;
    };

    // Verificar si el usuario tiene un rol específico
    const hasRole = (role: User['role']): boolean => {
        return user?.role === role;
    };

    // Verificar si el usuario tiene alguno de los roles especificados
    const hasAnyRole = (roles: User['role'][]): boolean => {
        return !!user && roles.includes(user.role);
    };

    const value: AuthContextType = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
        isAuthenticated,
        hasRole,
        hasAnyRole,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;