import Hero from "@/components/Hero";
import TrustedBy from "@/components/TrustedBy";
import About from "@/components/About";
import Services from "@/components/Services";
import Skills from "@/components/Skills";
import FeaturedProjects from "@/components/FeaturedProjects";
import WorkProcess from "@/components/WorkProcess";
import Testimonials from "@/components/Testimonials";
import Blog from "@/components/Blog";
import Certifications from "@/components/Certifications";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <TrustedBy />
      <About />
      <Services />
      <Skills />
      <FeaturedProjects />
      <WorkProcess />
      <Testimonials />
      <Blog />
      <Certifications />
      <ContactSection />
    </div>
  );
}
