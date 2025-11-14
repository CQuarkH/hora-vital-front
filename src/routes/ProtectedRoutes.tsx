import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { User } from "../types/auth/auth_types";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: User["role"][];
  requireAuth?: boolean;
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
  requireAuth = true,
}: ProtectedRouteProps) => {
  const { isAuthenticated, hasAnyRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Si requiere autenticación y no está autenticado
  if (requireAuth && !isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si no requiere autenticación pero está autenticado (para páginas de login/register)
  if (!requireAuth && isAuthenticated()) {
    return <Navigate to="/home" replace />;
  }

  // Si se especifican roles permitidos, verificar
  if (allowedRoles && allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
