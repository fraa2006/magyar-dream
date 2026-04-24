import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('md_token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/auth/me')
        .then(({ data }) => setUser(data.user))
        .catch(() => localStorage.removeItem('md_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const register = async (fields) => {
    const { data } = await api.post('/auth/register', fields);
    localStorage.setItem('md_token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data.user);
    return data;
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('md_token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('md_token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const refreshUser = async () => {
    const { data } = await api.get('/auth/me');
    setUser(data.user);
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const isUser = user?.role === 'user' || user?.role === 'scout';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, refreshUser, isAdmin, isUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
