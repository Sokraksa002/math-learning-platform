import { Navigate } from "react-router-dom";
import { getUser, isLoggedIn } from "../utils/auth";

type AllowedRole = "ADMIN" | "STUDENT" | "admin" | "student";

export default function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo,
}: {
  children: React.ReactNode;
  allowedRoles?: AllowedRole[];
  redirectTo?: string;
}) {
  /* ✅ NOT LOGGED IN */
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  /* ✅ GET USER (ALWAYS) */
  const user = getUser();
  const role = (user?.role ?? "").toString();

  console.log("ProtectedRoute role:", role); // DEBUG
  console.log("Allowed roles:", allowedRoles); // DEBUG

  /* ROLE CHECK (case-insensitive) */
  if (allowedRoles && allowedRoles.length > 0) {
    const roleNormalized = role.toLowerCase();
    const allowedNormalized = allowedRoles.map((r) => r.toString().toLowerCase());
    if (!role || !allowedNormalized.includes(roleNormalized)) {
      return <Navigate to={redirectTo ?? "/dashboard"} replace />;
    }
  }

  /* ✅ ALLOW ACCESS */
  return <>{children}</>;
}