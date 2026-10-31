"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadModal from "@/components/LeadModal";
import ChatBot from "@/components/ChatBot";
import {
  ScrollProgressBar,
  FloatingWhatsAppButton,
  BackToTopButton,
} from "@/components/ExtraFeatures";

export default function PublicShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main className="relative z-10">{children}</main>;
  }

  return (
    <>
      <ScrollProgressBar />
      <Navbar />
      <main className="relative z-10">{children}</main>
      <Footer />
      <LeadModal />
      <ChatBot />
      <FloatingWhatsAppButton />
      <BackToTopButton />
    </>
  );
}

