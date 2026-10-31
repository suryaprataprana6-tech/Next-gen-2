"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Admin";
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check existing session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const storedToken = typeof window !== "undefined" ? localStorage.getItem("nextgen_admin_jwt") : null;
        const res = await fetch("/api/admin/auth/me", {
          headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {},
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setAdmin(data.user);
            if (storedToken) setToken(storedToken);
          }
        } else {
          // Cookie/token invalid
          if (typeof window !== "undefined") {
            localStorage.removeItem("nextgen_admin_jwt");
          }
          setAdmin(null);
          setToken(null);
        }
      } catch (err) {
        console.warn("Session check error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    checkSession();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAdmin(data.user);
        setToken(data.token);
        if (typeof window !== "undefined") {
          localStorage.setItem("nextgen_admin_jwt", data.token);
        }
        return { success: true };
      } else {
        return { success: false, error: data.message || "Invalid credentials." };
      }
    } catch (err: any) {
      return { success: false, error: err.message || "Network error." };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } catch (e) {
      // ignore
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("nextgen_admin_jwt");
    }
    setAdmin(null);
    setToken(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!admin,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}

