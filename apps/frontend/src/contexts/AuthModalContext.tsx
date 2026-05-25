import React, { createContext, useContext, useState } from "react";
import LoginModal from "../components/Auth/LoginModal";
import RegisterModal from "../components/Auth/RegisterModal";

type AuthModalContextValue = {
  openLogin: () => void;
  openRegister: () => void;
  closeAll: () => void;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export const AuthModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const openLogin = () => {
    setRegisterOpen(false);
    setLoginOpen(true);
  };

  const openRegister = () => {
    setLoginOpen(false);
    setRegisterOpen(true);
  };

  const closeAll = () => {
    setLoginOpen(false);
    setRegisterOpen(false);
  };

  return (
    <AuthModalContext.Provider value={{ openLogin, openRegister, closeAll }}>
      {children}
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <RegisterModal open={registerOpen} onClose={() => setRegisterOpen(false)} />
    </AuthModalContext.Provider>
  );
};

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within AuthModalProvider");
  return ctx;
}

export default AuthModalContext;
