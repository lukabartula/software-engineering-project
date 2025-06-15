import React, { createContext, useState, useEffect } from 'react';
import { setAuthToken } from '../../api/api';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);  

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setToken(storedToken);
        setUser({
          id: decoded.userId,
          username: decoded.username,
          role: decoded.role
        });
        setAuthToken(storedToken);
      } catch (err) {
        console.error("Invalid token:", err);
        logout();
      }
    }
    setIsLoading(false);  // important: always set loading to false
  }, []);

  const login = (token) => {
    try {
      const decoded = jwtDecode(token);
      setToken(token);
      setUser({
        id: decoded.userId,
        username: decoded.username,
        role: decoded.role
      });
      localStorage.setItem('token', token);
      setAuthToken(token);
    } catch (err) {
      console.error("Invalid token on login:", err);
      logout();
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
