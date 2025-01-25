import React, { createContext, useState, useEffect, ReactNode } from "react";
import { Participant } from "../hooks/useParticipants";

export interface UserContextType {
  userContext: Participant | null;
  setUserContext: (user: Participant | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // Inicialize o estado com os dados do localStorage
  const [userContext, setUserContextState] = useState<Participant | null>(
    () => {
      const storedUser = localStorage.getItem("userContext");
      return storedUser ? JSON.parse(storedUser) : null;
    }
  );

  // Atualiza o localStorage quando userContext muda
  useEffect(() => {
    if (userContext) {
      localStorage.setItem("userContext", JSON.stringify(userContext));
    } else {
      localStorage.removeItem("userContext");
    }
  }, [userContext]);

  const setUserContext = (user: Participant | null) => {
    setUserContextState(user);
  };

  return (
    <UserContext.Provider value={{ userContext, setUserContext }}>
      {children}
    </UserContext.Provider>
  );
};
