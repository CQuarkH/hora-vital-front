export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    rut: string;
    role: 'patient' | 'secretary' | 'admin';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    rut: string;
}

export interface UpdateProfileData {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
    };
}

export interface ApiError {
    success: false;
    error: {
        code: string;
        message: string;
        details?: any[];
    };
}

export interface ServiceResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}