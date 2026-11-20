import { useEffect, useState } from "react";
import { TbBrandGithubFilled, TbMoon, TbSun } from "react-icons/tb";
import Hero from "./components/Hero";
import About from "./components/About";
import Contact from "./components/Contact";
import TechnicalStack from "./components/TechnicalStack";
import Projects from "./components/Projects";
import Clubs from "./components/Clubs";
import Footer from "./components/Footer";
import Entrance from "./components/Entrance";

type Theme = "dark" | "light";

const THEME_KEY = "theme";
const THEME_COLOR: Record<Theme, string> = { dark: "#0e0e0e", light: "#efeee9" };
// Sections the nav links point at, in page order.
const NAV_SECTIONS = ["projects", "clubs", "about", "contact"];

function readSavedTheme(): Theme | null {
  try {
    const saved = window.localStorage.getItem(THEME_KEY);
    return saved === "dark" || saved === "light" ? saved : null;
  } catch {
    return null;
  }
}

function saveTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Storage unavailable: the choice lasts for this page view only.
  }
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(
    () =>
      readSavedTheme() ??
      (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"),
  );
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    document
      .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
      ?.setAttribute("content", THEME_COLOR[theme]);
  }, [theme]);

  useEffect(() => {
    // The current section is the last one whose top has passed 45% of the viewport.
    // At the very bottom of the page the last section wins, since a short final
    // section (Contact) may never reach that line on tall screens.
    let frame = 0;
    const update = () => {
      frame = 0;
      const root = document.documentElement;
      const atBottom = window.innerHeight + window.scrollY >= root.scrollHeight - 2;
      const line = window.innerHeight * 0.45;
      let current: string | null = null;
      for (const id of NAV_SECTIONS) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= line) current = id;
      }
      if (atBottom && window.scrollY > 0) current = NAV_SECTIONS[NAV_SECTIONS.length - 1];
      setActiveSection(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const current = (id: string) => (activeSection === id ? "location" : undefined);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    saveTheme(next);
    setTheme(next);
  };

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
          <a href="#projects" aria-current={current("projects")}>Work</a>
          <a href="#clubs" aria-current={current("clubs")}>Clubs</a>
          <a href="#about" aria-current={current("about")}>About</a>
          <a href="#contact" aria-current={current("contact")}>Contact</a>
        </nav>
        <div className="header-actions">
          <a
            className="icon-control header-github"
            href="https://github.com/7shep"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile (opens in a new tab)"
          >
            <TbBrandGithubFilled aria-hidden />
          </a>
          <button
            className="icon-control theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <TbSun aria-hidden /> : <TbMoon aria-hidden />}
          </button>
        </div>
      </header>
      <main id="main">
        <Hero />
        <Projects />
        <Clubs />
        <TechnicalStack />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
