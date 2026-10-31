import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import PublicShell from "@/components/PublicShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "NextGen Digital Solutions | Websites, Ads & Digital Growth",
  description: "NextGen Digital Solutions engineers high-converting web applications, precision Meta & Google ad funnels, and automated lead generation engines that scale revenue.",
  keywords: [
    "NextGen Digital Solutions",
    "Digital Solutions Agency",
    "High Converting Websites",
    "Next.js Web Applications",
    "Meta Ads Agency",
    "Google Ads Specialists",
    "Lead Generation Systems",
    "Technical SEO"
  ],
  authors: [{ name: "NextGen Digital Solutions", url: "https://next-gen-2.vercel.app" }],
  creator: "NextGen Digital Solutions",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://next-gen-2.vercel.app"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://next-gen-2.vercel.app",
    title: "NextGen Digital Solutions | Websites, Ads & Digital Growth",
    description: "Engineering scalable, high-converting digital applications with Next.js, precision ad funnels, and automated lead generation engines.",
    siteName: "NextGen Digital Solutions",
    images: [
      {
        url: "/logo.png",
        width: 1254,
        height: 1254,
        alt: "NextGen Digital Solutions Official Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NextGen Digital Solutions | Websites, Ads & Digital Growth",
    description: "High-converting web applications, Meta & Google Ads, and automated lead generation funnels.",
    images: ["/logo.png"],
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
          <AdminAuthProvider>
            <PublicShell>{children}</PublicShell>
          </AdminAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
