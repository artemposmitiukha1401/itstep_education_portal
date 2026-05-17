import { createContext, useContext } from "react";

const AuthModalContext = createContext({
  openLogin: () => {},
  openRegister: () => {},
});

export function AuthModalProvider({ children, openLogin, openRegister }) {
  return (
    <AuthModalContext.Provider
      value={{
        openLogin,
        openRegister,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export const useAuthModal = () => useContext(AuthModalContext);