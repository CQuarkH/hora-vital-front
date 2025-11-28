# HoraVital - Contrato de Integración Frontend-Backend v2

## Información General

- **Frontend URL**: `http://localhost:5173`
- **Backend URL**: `http://localhost:4000` (configurable via `VITE_API_URL`)
- **Autenticación**: JWT Bearer Token en header `Authorization: Bearer <token>`

---

## Casos de Uso - Estado de Cobertura

| ID    | Nombre                | Estado Backend | Endpoint(s)                                                            |
| ----- | --------------------- | -------------- | ---------------------------------------------------------------------- |
| CU-01 | Ver Perfil            | ✅ Listo       | `GET /api/users/profile`                                               |
| CU-02 | Editar Perfil         | ✅ Listo       | `PUT /api/users/profile`                                               |
| CU-03 | Ver Notificaciones    | ✅ Listo       | `GET /api/notifications`, `PATCH /:id/read`                            |
| CU-04 | Agendar Cita Médica   | ✅ Listo       | `POST /api/appointments` + availability + medical                      |
| CU-05 | Ver Citas Médicas     | ✅ Listo       | `GET /api/appointments/my-appointments`, `GET /api/admin/appointments` |
| CU-06 | Editar Cita Médica    | ✅ Listo       | `PUT /api/appointments/:id`, `PATCH /:id/cancel`                       |
| CU-07 | Ver Pacientes         | ✅ Listo       | `GET /api/admin/patients`                                              |
| CU-08 | Agenda                | ⚠️ Parcial     | `POST /api/admin/schedules` (crear) / Ver-Editar ❌                    |
| CU-09 | Desplegar Calendario  | ✅ Listo       | `GET /api/calendar/availability`                                       |
| CU-10 | Registrar Paciente    | ✅ Listo       | `POST /api/admin/users` (role=PATIENT)                                 |
| CU-11 | Registrar Secretarios | ✅ Listo       | `POST /api/admin/users` (role=SECRETARY)                               |

---

## Endpoints Disponibles en Backend

### 1. Autenticación (`/api/auth`)

#### POST `/api/auth/register`

```typescript
// Request
{
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

// Response 201
{
  message: "Usuario registrado exitosamente",
  user: User,
  token: string
}
```

#### POST `/api/auth/login`

```typescript
// Request
{
  email: string;
  password: string;
}

// Response 200
{
  message: "Login exitoso",
  user: User,
  token: string
}
```

---

### 2. Perfil (`/api/users`)

> ⚠️ **IMPORTANTE**: El backend usa `/api/users/profile`. Ajustar frontend si usa `/api/profile`.

#### GET `/api/users/profile`

```typescript
// Headers: Authorization: Bearer <token>

// Response 200
{
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
```

#### PUT `/api/users/profile`

```typescript
// Headers: Authorization: Bearer <token>

// Request (todos opcionales)
{
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  gender?: string;
  address?: string;
}

// Response 200
User
```

---

### 3. Notificaciones (`/api/notifications`)

#### GET `/api/notifications`

```typescript
// Headers: Authorization: Bearer <token>
// Query params: ?page=1&limit=20&isRead=true|false

// Response 200
{
  notifications: [
    {
      id: string;
      userId: string;
      type: "APPOINTMENT_REMINDER" | "APPOINTMENT_CONFIRMATION" | "APPOINTMENT_CANCELLATION" | "GENERAL";
      title: string;
      message: string;
      isRead: boolean;
      data?: any;
      createdAt: string;
      updatedAt: string;
    }
  ],
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  }
}
```

#### PATCH `/api/notifications/:id/read`

```typescript
// Headers: Authorization: Bearer <token>

// Response 200
{
  message: "Notificación marcada como leída",
  notification: Notification
}
```

---

### 4. Médicos y Especialidades (`/api/medical`)

#### GET `/api/medical/specialties`

```typescript
// Headers: Authorization: Bearer <token>

// Response 200
[
  {
    id: string;
    name: string;
    description?: string;
  }
]
```

#### GET `/api/medical/doctors`

```typescript
// Headers: Authorization: Bearer <token>
// Query params: ?specialtyId=<uuid>

// Response 200
[
  {
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
]
```

---

### 5. Citas (`/api/appointments`)

#### GET `/api/appointments/availability`

```typescript
// Query params: ?date=2025-01-15&specialtyId=<uuid>&doctorProfileId=<uuid>

// Response 200
{
  availableSlots: [
    {
      doctorProfile: {
        id: string;
        name: string;
        specialty: string;
      };
      date: string;
      startTime: string;
      endTime: string;
    }
  ]
}
```

#### POST `/api/appointments`

```typescript
// Headers: Authorization: Bearer <token>

// Request
{
  doctorProfileId: string;
  specialtyId: string;
  appointmentDate: string;  // "2025-01-15"
  startTime: string;        // "09:00"
  notes?: string;
}

// Response 201
{
  message: "Cita creada exitosamente",
  appointment: Appointment
}
```

#### GET `/api/appointments/my-appointments`

```typescript
// Headers: Authorization: Bearer <token>
// Query params: ?status=SCHEDULED|CANCELLED|COMPLETED|NO_SHOW&dateFrom=2025-01-01&dateTo=2025-12-31

// Response 200
{
  appointments: Appointment[]
}
```

#### PUT `/api/appointments/:id` ✅ NUEVO

```typescript
// Headers: Authorization: Bearer <token>
// Permisos: Dueño de la cita O rol SECRETARY/ADMIN

// Request (todos opcionales)
{
  doctorProfileId?: string;
  specialtyId?: string;
  appointmentDate?: string;
  startTime?: string;
  notes?: string;
}

// Response 200
{
  message: "Cita actualizada exitosamente",
  appointment: Appointment
}

// Errores posibles:
// 400 - No se puede editar cita cancelada/completada
// 403 - No tienes permisos para editar esta cita
// 404 - Cita/Médico no encontrado
// 409 - El horario ya está reservado
```

#### PATCH `/api/appointments/:id/cancel`

```typescript
// Headers: Authorization: Bearer <token>

// Request
{
  cancellationReason?: string;
}

// Response 200
{
  message: "Cita cancelada exitosamente",
  appointment: Appointment
}
```

---

### 6. Administración (`/api/admin`)

> Requiere rol: `ADMIN` o `SECRETARY` según el endpoint

#### GET `/api/admin/users`

```typescript
// Headers: Authorization: Bearer <token>
// Requiere: role === "ADMIN"
// Query params: ?page=1&limit=20

// Response 200
{
  users: User[],
  meta: PaginationMeta
}
```

#### POST `/api/admin/users`

```typescript
// Headers: Authorization: Bearer <token>
// Requiere: role === "ADMIN"

// Request
{
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

// Response 201
User
```

#### PUT `/api/admin/users/:id`

```typescript
// Headers: Authorization: Bearer <token>
// Requiere: role === "ADMIN"

// Request (todos opcionales)
{
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: string;
  phone?: string;
  gender?: string;
  birthDate?: string;
  address?: string;
}

// Response 200
User
```

#### PATCH `/api/admin/users/:id/status`

```typescript
// Headers: Authorization: Bearer <token>
// Requiere: role === "ADMIN"

// Request
{
  isActive: boolean;
}

// Response 200
User;
```

#### GET `/api/admin/patients` ✅ NUEVO

```typescript
// Headers: Authorization: Bearer <token>
// Requiere: role === "ADMIN" | "SECRETARY"
// Query params: ?page=1&limit=20&name=Juan&rut=12.345.678-9&status=true

// Response 200
{
  patients: [
    {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      rut: string;
      phone: string;
      isActive: boolean;
      gender?: string;
      birthDate?: string;
      address?: string;
      createdAt: string;
      updatedAt: string;
    }
  ],
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  }
}
```

#### GET `/api/admin/appointments`

```typescript
// Headers: Authorization: Bearer <token>
// Requiere: role === "ADMIN" | "SECRETARY"
// Query params: ?page=1&limit=20&date=2025-01-15&patientName=Juan&doctorName=María&status=SCHEDULED&specialtyId=<uuid>

// Response 200
{
  appointments: [
    {
      id: string;
      appointmentDate: string;
      startTime: string;
      endTime: string;
      status: string;
      patient: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        rut: string;
      };
      doctorProfile: {
        id: string;
        user: { id: string; firstName: string; lastName: string; };
        specialty: { id: string; name: string; };
      };
      specialty: { id: string; name: string; };
    }
  ],
  meta: PaginationMeta
}
```

#### POST `/api/admin/schedules`

```typescript
// Headers: Authorization: Bearer <token>
// Requiere: role === "ADMIN" | "SECRETARY"

// Request
{
  doctorProfileId: string;
  dayOfWeek: number;      // 0=Domingo, 1=Lunes, ..., 6=Sábado
  startTime: string;      // "09:00"
  endTime: string;        // "18:00"
  slotDuration?: number;  // default 30
}

// Response 201
Schedule
```

---

### 7. Calendario (`/api/calendar`) ✅ NUEVO

#### GET `/api/calendar/availability`

```typescript
// Headers: Authorization: Bearer <token>
// Requiere: role === "ADMIN" | "SECRETARY"
// Query params (requeridos): ?startDate=2025-01-01&endDate=2025-01-31
// Query params (opcionales): &doctorProfileId=<uuid>&specialtyId=<uuid>

// Response 200
{
  calendar: {
    [date: string]: {
      totalSlots: number;
      availableSlots: number;
      bookedSlots: number;
    }
  }
}
```

---

## Endpoints PENDIENTES (No existen en backend)

Solo quedan **2 endpoints** pendientes para CU-08:

| Endpoint                                    | Caso de Uso                      | Acción Frontend        |
| ------------------------------------------- | -------------------------------- | ---------------------- |
| `GET /api/admin/schedules/:doctorProfileId` | CU-08: Ver horarios configurados | Mock con datos locales |
| `PUT /api/admin/schedules/:doctorProfileId` | CU-08: Modificar horarios        | Mock con console.warn  |

---

## Mapeo: Páginas Frontend → Endpoints

| Página                       | Endpoints                                                                                  | Estado                           |
| ---------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------- |
| `LoginPage.tsx`              | `POST /api/auth/login`                                                                     | ✅ Integrar                      |
| `RegisterPage.tsx`           | `POST /api/auth/register`                                                                  | ✅ Integrar                      |
| `ProfilePage.tsx`            | `GET/PUT /api/users/profile`                                                               | ✅ Integrar (corregir URL)       |
| `NotificationsPage.tsx`      | `GET /api/notifications`, `PATCH /:id/read`                                                | ✅ Integrar                      |
| `BookAppointmentPage.tsx`    | `GET /api/medical/*`, `GET /api/appointments/availability`, `POST /api/appointments`       | ✅ Integrar                      |
| `MyAppointmentsPage.tsx`     | `GET /api/appointments/my-appointments`                                                    | ✅ Integrar                      |
| `AppointmentDetailPage.tsx`  | `PUT /api/appointments/:id`, `PATCH /:id/cancel`                                           | ✅ Integrar                      |
| `AdminHomePage.tsx`          | `GET /api/admin/users`, `PUT /:id`, `PATCH /:id/status`                                    | ✅ Integrar                      |
| `CreateUserPage.tsx`         | `POST /api/admin/users`                                                                    | ✅ Integrar                      |
| `SecretaryHomePage.tsx`      | `GET /api/admin/appointments` (date=hoy)                                                   | ✅ Integrar                      |
| `AdminAppointmentsPage.tsx`  | `GET /api/admin/appointments`                                                              | ✅ Integrar                      |
| `AdminPatientsPage.tsx`      | `GET /api/admin/patients`                                                                  | ✅ Integrar                      |
| `ScheduleManagementPage.tsx` | `POST /api/admin/schedules`, `GET/PUT schedules/:id`                                       | ⚠️ Crear ✅ / Ver-Editar ❌ Mock |
| `CreateAppointmentPage.tsx`  | `GET /api/medical/doctors`, `GET /api/appointments/availability`, `POST /api/appointments` | ✅ Integrar                      |

---

## Servicios Frontend a Crear

```
src/services/
├── admin/
│   └── adminService.ts          # CREAR
└── secretary/
    └── scheduleService.ts       # CREAR (con mocks para GET/PUT)
```

### Ejemplo: adminService.ts

```typescript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

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

  // Pacientes ✅ NUEVO
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

    const response = await fetch(
      `${API_URL}/api/admin/appointments?${searchParams.toString()}`,
      { headers: this.getHeaders() }
    );
    if (!response.ok) throw new Error("Error al obtener citas");
    return response.json();
  }

  // Calendario ✅ NUEVO
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

  // ⚠️ MOCK - Endpoint no existe en backend
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

  // ⚠️ MOCK - Endpoint no existe en backend
  async updateSchedules(doctorProfileId: string, schedules: any[]) {
    console.warn(
      "updateSchedules: Endpoint no implementado en backend, cambios solo locales"
    );
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
  }
}

export const adminService = new AdminService();
```

---

## Corrección Requerida en Frontend

En `src/services/user/user_service.ts`:

```typescript
// ANTES
const response = await fetch(`${API_URL}/api/profile`, ...);

// DESPUÉS
const response = await fetch(`${API_URL}/api/users/profile`, ...);
```

---

## Datos de Seed para Testing

| Rol       | RUT          | Email                   | Password     |
| --------- | ------------ | ----------------------- | ------------ |
| Admin     | 11.111.111-1 | admin@horavital.cl      | Password123! |
| Secretary | 22.222.222-2 | secretaria@horavital.cl | Password123! |
| Patient   | 33.333.333-3 | paciente@horavital.cl   | Password123! |

---

## Checklist de Integración

### Endpoints listos (integrar)

- [ ] `POST /api/auth/login`
- [ ] `POST /api/auth/register`
- [ ] `GET /api/users/profile`
- [ ] `PUT /api/users/profile`
- [ ] `GET /api/notifications`
- [ ] `PATCH /api/notifications/:id/read`
- [ ] `GET /api/medical/specialties`
- [ ] `GET /api/medical/doctors`
- [ ] `GET /api/appointments/availability`
- [ ] `POST /api/appointments`
- [ ] `GET /api/appointments/my-appointments`
- [ ] `PUT /api/appointments/:id` ✅ NUEVO
- [ ] `PATCH /api/appointments/:id/cancel`
- [ ] `GET /api/admin/users`
- [ ] `POST /api/admin/users`
- [ ] `PUT /api/admin/users/:id`
- [ ] `PATCH /api/admin/users/:id/status`
- [ ] `GET /api/admin/patients` ✅ NUEVO
- [ ] `GET /api/admin/appointments`
- [ ] `POST /api/admin/schedules`
- [ ] `GET /api/calendar/availability` ✅ NUEVO

### Endpoints pendientes (mock)

- [ ] `GET /api/admin/schedules/:doctorProfileId` → Mock
- [ ] `PUT /api/admin/schedules/:doctorProfileId` → Mock

### Páginas a modificar

- [ ] `src/services/user/user_service.ts` - Corregir URL `/api/users/profile`
- [ ] `AdminHomePage.tsx` - Reemplazar MOCK_USERS_DATA
- [ ] `CreateUserPage.tsx` - Conectar con POST /api/admin/users
- [ ] `SecretaryHomePage.tsx` - Reemplazar MOCK_TODAY_APPOINTMENTS
- [ ] `AdminAppointmentsPage.tsx` - Reemplazar MOCK_ALL_APPOINTMENTS
- [ ] `AdminPatientsPage.tsx` - Usar GET /api/admin/patients (ya no filtrar manualmente)
- [ ] `ScheduleManagementPage.tsx` - Crear ✅ real / Ver-Editar mock
- [ ] `CreateAppointmentPage.tsx` - Integrar con endpoints reales
- [ ] `AppointmentDetailPage.tsx` - Agregar botón editar con PUT /api/appointments/:id
