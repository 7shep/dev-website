import { useState } from "react";
import { TbArrowUpRight, TbMoon, TbSun } from "react-icons/tb";
import Hero from "./components/Hero";
import About from "./components/About";
import TechnicalStack from "./components/TechnicalStack";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Entrance from "./components/Entrance";

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">(() =>
    window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark",
  );
  return (
    <div className="portfolio" data-theme={theme}>
      <Entrance />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header wrap">
        <a className="wordmark" href="#home" aria-label="Alex Shepherd home">
          as<span> /</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#projects">Work</a>
          <a href="#about">About</a>
          <a href="#contact">
            Contact <TbArrowUpRight aria-hidden />
          </a>
        </nav>
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          {theme === "dark" ? <TbSun /> : <TbMoon />}
        </button>
      </header>
      <main id="main">
        <Hero />
        <Projects />
        <About />
        <TechnicalStack />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
