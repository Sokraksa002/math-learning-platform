import { createContext } from "react";

export type AuthModalContextValue = {
  isLoginOpen: boolean;
  isRegisterOpen: boolean;

  openLogin: () => void;
  closeLogin: () => void;

  openRegister: () => void;
  closeRegister: () => void;

  closeAll: () => void;
};

export const AuthModalContext =
  createContext<AuthModalContextValue | null>(null);
