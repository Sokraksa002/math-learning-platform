import { Navigate } from 'react-router-dom';
import { getUser, isLoggedIn } from '../utils/auth';
import { useAuthModal } from '../contexts/AuthModalContext';

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
  const { openLogin } = useAuthModal();

  if (!isLoggedIn()) {
    openLogin();
    return null;
  }

  if (allowedRoles?.length) {
    const user = getUser();
    const userRole = user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      // open login as fallback
      openLogin();
      return null;
    }
  }

  return <>{children}</>;
}