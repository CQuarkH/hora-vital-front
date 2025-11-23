export interface Specialty {
    id: string;
    name: string;
    description?: string;
}

export interface Doctor {
    id: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    specialty: {
        id: string;
        name: string;
    };
}

export interface TimeSlot {
    doctorProfile: {
        id: string;
        name: string;
        specialty: string;
    };
    date: string;
    startTime: string;
    endTime: string;
}

export interface CreateAppointmentData {
    doctorProfileId: string;
    specialtyId: string;
    appointmentDate: string;
    startTime: string;
    notes?: string;
}

export interface Appointment {
    id: string;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    status: 'SCHEDULED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
    notes?: string;
    cancellationReason?: string;
    doctorProfile: {
        id: string;
        user: {
            firstName: string;
            lastName: string;
        };
        specialty: {
            name: string;
        };
    };
    specialty: {
        name: string;
    };
}