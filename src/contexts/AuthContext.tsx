
import React, { createContext, useContext, useState, useEffect } from 'react';

// A mock user type. For now, it's just an empty object.
interface User {}

interface AuthContextType {
  user: User | null;
  login: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // This is a mock login function
  const login = () => {
    setUser({}); // Set a mock user object
    localStorage.setItem('isAuthenticated', 'true');
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('isAuthenticated');
  };

  // Check if user was previously logged in
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setUser({});
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
