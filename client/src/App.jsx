import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { WebsiteProvider } from "./context/WebsiteContext";

// Public Components
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import LeadModal from "./components/LeadModal";
import ChatBot from "./components/ChatBot";

function PublicApp() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prefilledInterest, setPrefilledInterest] = useState("");

  const openModal = (interest = "") => {
    setPrefilledInterest(interest);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  return (
    <div className="relative min-h-screen bg-white">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-[50vw] h-[50vw] rounded-full blur-[140px] opacity-40 bg-gradient-to-br from-primary/20 to-transparent -top-[10vw] -right-[5vw] animate-float-1"></div>
        <div className="absolute w-[55vw] h-[55vw] rounded-full blur-[140px] opacity-45 bg-gradient-to-br from-secondary/20 to-transparent top-[25vw] -left-[10vw] animate-float-2"></div>
      </div>

      <Navbar onOpenModal={openModal} />
      <Home onOpenModal={openModal} />
      
      <LeadModal 
         isOpen={isModalOpen} 
         onClose={closeModal} 
         prefilledInterest={prefilledInterest} 
      />
      <ChatBot />
    </div>
  );
}

function App() {
  return (
    <WebsiteProvider>
      <Router>
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<PublicApp />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </WebsiteProvider>
  );
}

export default App;
