export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full py-16 px-6 flex flex-col items-center justify-center gap-6 bg-transparent">
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <a
          href="https://github.com/7shep"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className="text-on-surface-variant hover:text-primary transition-colors duration-200 flex items-center gap-2 font-label text-[10px] tracking-[0.3em] uppercase"
        >
          <span className="material-symbols-outlined text-lg">code</span>
          GitHub
        </a>
        <span className="text-outline-variant">||</span>
        <a
          href="https://linkedin.com/in/7shep"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          className="text-on-surface-variant hover:text-primary transition-colors duration-200 flex items-center gap-2 font-label text-[10px] tracking-[0.3em] uppercase"
        >
          <span className="material-symbols-outlined text-lg">link</span>
          LinkedIn
        </a>
        <span className="text-outline-variant">||</span>
        <a
          href="mailto:alshe0644@gmail.com"
          aria-label="Email"
          className="text-on-surface-variant hover:text-primary transition-colors duration-200 flex items-center gap-2 font-label text-[10px] tracking-[0.3em] uppercase"
        >
          <span className="material-symbols-outlined text-lg">mail</span>
          Email
        </a>
      </div>
      <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-tertiary/30 to-transparent" />
      <div className="text-on-surface-variant/60 font-label text-[9px] tracking-[0.3em] uppercase">
        © {year} Alex Shepherd
      </div>
    </footer>
  );
}
