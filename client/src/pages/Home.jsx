import React, { useEffect, useRef, useState } from "react";
import Hero from "../components/Hero";
import Services from "../components/Services";
import WhyChooseUs from "../components/WhyChooseUs";
import Portfolio from "../components/Portfolio";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import Footer from "../components/Footer";


function Home({ onOpenModal }) {
  // Global Scroll Reveal handler
  useEffect(() => {
    const revealElements = document.querySelectorAll("[data-reveal]");
    
    // Add layout base classes to reveal elements
    revealElements.forEach((el) => {
      el.style.opacity = "0";
      el.style.transition = "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
      if (el.getAttribute("data-reveal") === "slide-up") {
        el.style.transform = "translateY(30px)";
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            if (entry.target.getAttribute("data-reveal") === "slide-up") {
              entry.target.style.transform = "translateY(0)";
            }
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative z-10">
      
      {/* 1. Hero Section */}
      <Hero onOpenModal={onOpenModal} />

      {/* 3. Services Section */}
      <Services onOpenModal={onOpenModal} />

      {/* 4. Why Choose Us Section */}
      <WhyChooseUs />

      {/* 5. Portfolio Section */}
      <Portfolio />

      {/* 6. Testimonials Section */}
      <Testimonials />

      {/* 7. Call To Action Section */}
      <CTA onOpenModal={onOpenModal} />

      {/* 8. Footer Section */}
      <Footer onOpenModal={onOpenModal} />

    </div>
  );
}

export default Home;
