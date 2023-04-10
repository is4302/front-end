// hooks/useAuth.js
import { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';

export default function useAuth() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: any, password: any) => {
    try {
      const response = await apiClient.post('/login', { email, password });
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return { token, loading, login, logout };
}
