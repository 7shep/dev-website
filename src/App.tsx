import Hero from "./components/Hero";
import TechnicalStack from "./components/TechnicalStack";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <main className="relative min-h-screen star-field overflow-hidden bg-background text-on-surface font-body selection:bg-primary/30">
      <Hero />
      <TechnicalStack />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}
