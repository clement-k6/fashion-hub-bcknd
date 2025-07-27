import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  name: string;
  avatarColor: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<string | null>;
  signup: (name: string, email: string, password: string) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getAvatarColor(name: string) {
  const colors = ['bg-blue-500','bg-green-500','bg-purple-500','bg-pink-500','bg-yellow-500','bg-red-500','bg-indigo-500'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function getUsers(): Record<string, { name: string; password: string; avatarColor: string }> {
  const data = localStorage.getItem('users');
  return data ? JSON.parse(data) : {};
}

function saveUsers(users: Record<string, { name: string; password: string; avatarColor: string }>) {
  localStorage.setItem('users', JSON.stringify(users));
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const session = localStorage.getItem('session');
    if (session) {
      const { email, name, avatarColor } = JSON.parse(session);
      setUser({ email, name, avatarColor });
    }
  }, []);

  const login = async (email: string, password: string) => {
    const users = getUsers();
    if (!users[email]) return 'No account found with that email.';
    if (users[email].password !== password) return 'Incorrect password.';
    const { name, avatarColor } = users[email];
    setUser({ email, name, avatarColor });
    localStorage.setItem('session', JSON.stringify({ email, name, avatarColor }));
    return null;
  };

  const signup = async (name: string, email: string, password: string) => {
    const users = getUsers();
    if (users[email]) return 'An account with that email already exists.';
    const avatarColor = getAvatarColor(name);
    users[email] = { name, password, avatarColor };
    saveUsers(users);
    setUser({ email, name, avatarColor });
    localStorage.setItem('session', JSON.stringify({ email, name, avatarColor }));
    return null;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('session');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
} 