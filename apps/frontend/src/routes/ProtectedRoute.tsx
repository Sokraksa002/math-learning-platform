import { Navigate } from "react-router-dom";
import { getUser, isLoggedIn } from "../utils/auth";

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
  // ✅ if not logged in → go to login page
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  // ✅ role protection (optional)
  if (allowedRoles?.length) {
    const user = getUser();
    const role = user?.role;

    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to={redirectTo ?? "/dashboard"} replace />;
    }
  }

  // ✅ allow access
  return <>{children}</>;
}