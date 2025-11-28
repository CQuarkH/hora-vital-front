import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Input } from "../../components/Input";
import { formatRUT, formatPhoneNumber } from "../../utils/formatters";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { adminService } from "../../services/admin/adminService";
import { useAuth } from "../../context/AuthContext";

interface CreateUserFormValues {
  firstName: string;
  lastName: string;
  rut: string;
  email: string;
  phone: string;
  password: string;
  role: "patient" | "secretary" | "admin";
}

export default function CreateUserPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { user: currentUser } = useAuth();

  // Normalizamos a minúsculas para comparar fácilmente
  const isSecretary = currentUser?.role?.toLowerCase() === "secretary";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    // 2. LÓGICA DE VALOR POR DEFECTO
    // Si es secretario, el form inicia obligatoriamente como 'patient'
    defaultValues: {
      role: isSecretary ? "patient" : "secretary",
    },
  });

  const onSubmit = async (data: CreateUserFormValues) => {
    setError(null);
    setLoading(true);

    try {
      const roleMap = {
        patient: "PATIENT" as const,
        secretary: "SECRETARY" as const,
        admin: "ADMIN" as const,
      };

      await adminService.createUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        rut: data.rut,
        phone: data.phone,
        role: roleMap[data.role],
      });

      toast.success(`Usuario ${data.firstName} ${data.lastName} creado exitosamente`);
      navigate("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/home")}
        className="flex items-center gap-1 text-sm font-medium text-medical-600 hover:text-medical-800 mb-4"
      >
        <HiOutlineArrowLeft />
        Volver al Panel de Administración
      </button>

      <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Usuario</h1>
      <p className="text-gray-600 mb-6">
        {isSecretary
          ? "Registra un nuevo paciente en el sistema."
          : "Registra un nuevo usuario en el sistema (ej. Secretario/a, Admin)."}
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col bg-medical-50 border border-medical-200 shadow-sm p-6 rounded-xl gap-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre"
            error={errors.firstName?.message}
            {...register("firstName", { required: "El nombre es obligatorio" })}
          />
          <Input
            label="Apellido"
            error={errors.lastName?.message}
            {...register("lastName", {
              required: "El apellido es obligatorio",
            })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="RUT"
            formatter={formatRUT}
            error={errors.rut?.message}
            {...register("rut", {
              required: "El RUT es obligatorio",
              pattern: {
                value: /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/,
                message: "Formato de RUT inválido",
              },
            })}
          />
          <Input
            label="Teléfono"
            formatter={formatPhoneNumber}
            error={errors.phone?.message}
            {...register("phone", { required: "El teléfono es obligatorio" })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Correo"
            type="email"
            error={errors.email?.message}
            {...register("email", {
              required: "El correo es obligatorio",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Correo inválido",
              },
            })}
          />
          <Input
            label="Contraseña Provisional"
            type="password"
            error={errors.password?.message}
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: {
                value: 6,
                message: "Debe tener al menos 6 caracteres",
              },
            })}
          />

          {/* 3. RENDERIZADO CONDICIONAL DEL ROL */}
          <div className="flex flex-col gap-2 items-start w-full">
            <label className="text-sm font-medium">Asignación de Rol</label>

            {isSecretary ? (
              // CASO SECRETARIO/A: Input bloqueado visualmente, valor fijo 'patient'
              <div className="w-full relative">
                <select
                  {...register("role", { required: "El rol es obligatorio" })}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  <option value="patient">Paciente</option>
                </select>
              </div>
            ) : (
              // CASO ADMIN: Select completo
              <select
                {...register("role", { required: "El rol es obligatorio" })}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="secretary">Secretario/a</option>
                <option value="admin">Administrador</option>
                <option value="patient">Paciente</option>
              </select>
            )}
          </div>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-medical-700 text-white px-4 py-3 rounded-lg hover:bg-medical-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Registrando..." : "Registrar Usuario"}
        </button>
      </form>
    </div>
  );
}
