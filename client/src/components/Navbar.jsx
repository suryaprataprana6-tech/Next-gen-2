import React, { useState, useEffect } from "react";
import { Menu, X, BarChart3 } from "lucide-react";

function Navbar({ onOpenModal }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Why Choose Us", href: "#why-choose-us" },
    { name: "Testimonials", href: "#testimonials" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 border-b ${
          isScrolled
            ? "bg-white/90 border-borderBg shadow-sm backdrop-blur-md"
            : "bg-white/70 border-borderBg/50 backdrop-blur-md"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2.5 group">
            <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-md shadow-primary/20">
              <BarChart3 className="w-5 h-5" />
            </span>
            <span className="font-headings font-extrabold text-xl tracking-tight text-dark">
              NextGen <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Digital</span>
            </span>
          </a>

          {/* Desktop Navigation links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted hover:text-dark relative py-2 transition-colors duration-250 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:height-[2px] after:bg-gradient-to-r after:from-primary after:to-secondary hover:after:w-full after:transition-all after:duration-250"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onOpenModal()}
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm px-6 py-3 rounded-full hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Book Consultation
            </button>
            
            {/* Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-lg text-dark hover:bg-cardBg transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 z-50 bg-dark/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`absolute top-0 right-0 w-full max-w-[300px] h-full bg-white px-6 py-6 flex flex-col shadow-2xl transition-transform duration-300 transform ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-10">
            <span className="font-headings font-extrabold text-lg tracking-tight text-dark">
              NextGen <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Digital</span>
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-cardBg text-muted hover:text-dark transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-semibold text-dark hover:text-primary py-2.5 border-b border-borderBg transition-colors"
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenModal("General Growth");
              }}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 px-6 rounded-full mt-4 hover:shadow-lg transition-all"
            >
              Book Consultation
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Navbar;
