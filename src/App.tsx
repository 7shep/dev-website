import Hero from "./components/Hero";
import TechnicalStack from "./components/TechnicalStack";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ParticleBackground from "./components/ParticleBackground";

export default function App() {
  return (
    <main className="relative min-h-screen star-field overflow-hidden bg-background text-on-surface font-body selection:bg-primary/30">
      {/* Ambient twinkle dots */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <span className="absolute w-1 h-1 rounded-full bg-white/10 top-[15%] left-[8%]"  style={{ animation: "twinkle 3s ease-in-out infinite" }} />
        <span className="absolute w-1 h-1 rounded-full bg-white/10 top-[42%] right-[12%]" style={{ animation: "twinkle 4s ease-in-out infinite 1.2s" }} />
        <span className="absolute w-1 h-1 rounded-full bg-white/10 top-[68%] left-[18%]" style={{ animation: "twinkle 5s ease-in-out infinite 0.7s" }} />
        <span className="absolute w-1 h-1 rounded-full bg-white/10 top-[85%] right-[30%]" style={{ animation: "twinkle 3.5s ease-in-out infinite 2s" }} />
      </div>
      <Hero />
      <div className="relative">
        <ParticleBackground />
        <TechnicalStack />
        <Projects />
        <Contact />
      </div>
      <Footer />
    </main>
  );
}
