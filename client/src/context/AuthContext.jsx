import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("admin_token") || null);
  const [loading, setLoading] = useState(true);

  // Configure axios to always send token if it exists
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("admin_token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("admin_token");
    }
  }, [token]);

  // Load user profile on mount
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/auth/me`);
        if (response.data?.success) {
          setUser(response.data.user);
        } else {
          setToken(null);
        }
      } catch (err) {
        console.error("Auth verify failed:", err);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      if (response.data?.success && response.data?.token) {
        setToken(response.data.token);
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }
      return { success: false, message: response.data?.message || "Login failed" };
    } catch (err) {
      console.error("Login request failed:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Invalid credentials or server unavailable"
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
