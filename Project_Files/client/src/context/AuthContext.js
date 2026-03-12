import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('househunt_user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await loginUser({ email, password });
    localStorage.setItem('househunt_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (name, email, password, role) => {
    const { data } = await registerUser({ name, email, password, role });
    localStorage.setItem('househunt_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('househunt_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
