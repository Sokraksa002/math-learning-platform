/* ================= TYPES ================= */
export interface AuthUser {
  id?: number;
  name?: string;
  role?: "admin" | "student";
  email?: string;
}

/* ================= AUTH FUNCTIONS ================= */

export const login = (user: AuthUser): void => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = (): AuthUser | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const logout = (): void => {
  localStorage.removeItem("user");
};

export const isLoggedIn = (): boolean => {
  return Boolean(localStorage.getItem("user"));
};