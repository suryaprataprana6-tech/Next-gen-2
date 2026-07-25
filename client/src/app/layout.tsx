import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadModal from "@/components/LeadModal";
import ChatBot from "@/components/ChatBot";
import { 
  ScrollProgressBar, 
  CustomCursor, 
  FloatingWhatsAppButton, 
  BackToTopButton, 
  LoadingScreen 
} from "@/components/ExtraFeatures";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "NextGen | Digital Solutions & High-Converting Web Applications",
  description: "Redesigning digital growth with Next.js 15 App Router, high-converting web applications, technical SEO engines, and custom AI automations. 50+ projects delivered with 99% client satisfaction.",
  keywords: [
    "NextGen Digital Solutions",
    "Next.js Developer",
    "Digital Solutions",
    "Full Stack Architecture",
    "Technical SEO Specialist",
    "AI Chatbot Automation",
    "High Converting Portfolio"
  ],
  authors: [{ name: "NextGen Digital Solutions", url: "https://nextgendigital.com" }],
  creator: "NextGen Digital Solutions",
  metadataBase: new URL("https://nextgendigital.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nextgendigital.com",
    title: "NextGen | Digital Solutions & High-Converting Web Applications",
    description: "Engineering scalable, high-converting digital applications with Next.js 15, TypeScript, SEO schemas, and AI lead automation.",
    siteName: "NextGen Digital Solutions",
    images: [
      {
        url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "NextGen Digital Solutions Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NextGen | Digital Solutions & High-Converting Applications",
    description: "High-converting web applications, Next.js 15, SEO schemas, and AI lead automation.",
    images: ["https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&fit=crop&q=80"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans antialiased selection:bg-brand-500/30 selection:text-brand-400`}>
        <ThemeProvider>
          <LoadingScreen />
          <ScrollProgressBar />
          <CustomCursor />
          <Navbar />
          <main className="relative z-10">{children}</main>
          <Footer />
          <LeadModal />
          <ChatBot />
          <FloatingWhatsAppButton />
          <BackToTopButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
