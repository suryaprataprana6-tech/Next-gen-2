"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  theme: "dark" | "light";
  toggleTheme: () => void;
  isLeadModalOpen: boolean;
  prefilledService: string;
  openLeadModal: (serviceName?: string) => void;
  closeLeadModal: () => void;
  isConsultationModalOpen: boolean;
  openConsultationModal: () => void;
  closeConsultationModal: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [prefilledService, setPrefilledService] = useState("");
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("portfolio_theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("portfolio_theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const openLeadModal = (serviceName: string = "") => {
    setPrefilledService(serviceName);
    setIsLeadModalOpen(true);
  };

  const closeLeadModal = () => {
    setIsLeadModalOpen(false);
  };

  const openConsultationModal = () => {
    setIsConsultationModalOpen(true);
  };

  const closeConsultationModal = () => {
    setIsConsultationModalOpen(false);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        isLeadModalOpen,
        prefilledService,
        openLeadModal,
        closeLeadModal,
        isConsultationModalOpen,
        openConsultationModal,
        closeConsultationModal,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
