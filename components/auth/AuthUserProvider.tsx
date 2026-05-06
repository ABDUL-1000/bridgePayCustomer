"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
}

interface AuthUserContextType {
  user: User | null;
}

const AuthUserContext = createContext<AuthUserContextType | undefined>(
  undefined
);

interface AuthUserProviderProps {
  children: ReactNode;
  user: User | null;
}

export const AuthUserProvider: React.FC<AuthUserProviderProps> = ({
  children,
  user,
}) => {
  // Memoize the context value so a new object reference from the server
  // (e.g. JSON.parse on every navigation) does NOT cause a context re-render.
  const value = useMemo<AuthUserContextType>(
    () => ({ user }),
    // Stable comparison by serializing — avoids re-render when object is
    // structurally identical but referentially different.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user?.id, user?.email, user?.firstname, user?.lastname]
  );

  return (
    <AuthUserContext.Provider value={value}>
      {children}
    </AuthUserContext.Provider>
  );
};

export const useAuthUser = () => {
  const context = useContext(AuthUserContext);
  if (context === undefined) {
    throw new Error("useAuthUser must be used within an AuthUserProvider");
  }
  return context;
};
