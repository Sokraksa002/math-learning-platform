import { Navigate } from 'react-router-dom';
import { getUser, isLoggedIn } from '../utils/auth';

type AllowedRole = "admin" | "student";

export default function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo,
}: {
  children: React.ReactNode;
  allowedRoles?: AllowedRole[];
  redirectTo?: string;
}) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles?.length) {
    const user = getUser();
    const userRole = user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return <Navigate to={redirectTo ?? "/login"} replace />;
    }
  }

  return <>{children}</>;
}