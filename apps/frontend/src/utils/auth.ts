/* ================= TYPES ================= */
export interface AuthUser {
  id?: number;
  name?: string;
  role?: "admin" | "student";
  email?: string;
}

/* ================= AUTH FUNCTIONS ================= */

export const login = (user: AuthUser): void => {
  const normalized = user.role && typeof user.role === 'string' ? { ...user, role: user.role.toLowerCase() } : user;
  localStorage.setItem("user", JSON.stringify(normalized));
};

export function getUser() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  console.log("GET USER:", user);
  return user;
}

import { clearToken } from './api';

export const logout = (): void => {
  localStorage.removeItem('user');
  try {
    clearToken();
  } catch {
    // fallback
    localStorage.removeItem('mlp_token');
  }
};

export const isLoggedIn = (): boolean => {
  return Boolean(localStorage.getItem('user') || localStorage.getItem('mlp_token'));
};