import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('kidsfest_admin');
    if (stored) {
      try { setAdmin(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/admin/login', { email, password });
    setAdmin(data);
    localStorage.setItem('kidsfest_admin', JSON.stringify(data));
    return data;
  };

  const logout = async () => {
    try { await api.post('/admin/logout'); } catch { /* ignore */ }
    setAdmin(null);
    localStorage.removeItem('kidsfest_admin');
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
