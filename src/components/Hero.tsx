function scrollTo(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const start = window.scrollY;
  const end = target.getBoundingClientRect().top + start;
  const duration = 1000;
  const startTime = performance.now();

  function ease(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, start + (end - start) * ease(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center">
      {/* Background */}
      {/* Background layer removed for seamless page transition */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />

      {/* Orbit Rings */}
      <div className="orbit-path w-[350px] h-[350px] opacity-40" style={{ animation: "orbit-rotate 60s linear infinite" }} />
      <div className="orbit-path w-[550px] h-[550px] opacity-25" style={{ animation: "orbit-rotate 90s linear infinite reverse" }} />
      <div className="orbit-path w-[800px] h-[800px] opacity-10" style={{ animation: "orbit-rotate 120s linear infinite" }} />

      {/* Central Sun */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Spinning gradient border ring */}
        <div
          className="w-32 h-32 rounded-full p-[2px] sun-ring group cursor-pointer"
          style={{ animation: "sun-spin 4s linear infinite, sun-pulse 3s ease-in-out infinite, hero-fade-in 0.8s ease-out both" }}
        >
          {/* Counter-rotate so the inner image stays still */}
          <div
            className="w-full h-full rounded-full bg-surface-container-lowest flex items-center justify-center overflow-hidden"
            style={{ animation: "sun-spin 4s linear infinite reverse" }}
          >
            <img
              className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuGqVTFcefjqJfP49o_5YsvrceLWqUQqas8RJK1yjGTXG97grsUGImFGGfm6hxDQU-Zrk_9In5uj-3PVgMoGx1LlZvVxWCDonGoFXU_qULeQSWmHzICh_38bZbATnxevcehX5ZKKwJDhr9I6dKiB5TY5NfHgtvFL1lUvZpyIxKj-uXRFZYD9fiGX_Hv0KXrCyj5D-1mQMC6-pgzfJm3BWGWH5QeFxGli0MJCitoHmChJh0IbShVpKuy9p_P_S2gX9J1sO9I1hElp90"
              alt="cosmic nebula"
            />
          </div>
        </div>
        <div className="mt-8 text-center">
          <h1
            className="text-6xl md:text-8xl font-headline font-bold tracking-[-0.05em] text-on-surface"
            style={{ animation: "hero-fade-in 0.8s ease-out 0.3s both" }}
          >
            ALEX SHEPHERD
          </h1>
          <p
            className="font-label text-xs tracking-[0.5em] text-secondary mt-4 uppercase"
            style={{ animation: "hero-fade-in 0.8s ease-out 0.5s both" }}
          >
            future software engineer
          </p>
          <div
            className="flex items-center justify-center gap-3 mt-6 font-label text-[11px] tracking-widest uppercase text-on-surface-variant"
            style={{ animation: "hero-fade-in 0.8s ease-out 0.7s both" }}
          >
            <a
              href="https://github.com/7shep"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors duration-200"
            >
              GitHub
            </a>
            <span className="text-outline-variant">||</span>
            <a
              href="https://linkedin.com/in/7shep"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors duration-200"
            >
              LinkedIn
            </a>
            <span className="text-outline-variant">||</span>
            <button
              onClick={() => scrollTo("contact")}
              className="uppercase hover:text-primary transition-colors duration-200 cursor-pointer"
            >
              Contact Me
            </button>
            <span className="text-outline-variant">||</span>
            <a
              href="/assets/Alex_Shepherd_Resume_202526.pdf"
              download
              className="hover:text-primary transition-colors duration-200"
            >
              Resume
            </a>
          </div>
        </div>
      </div>

      {/* Planet 1: Skills */}
      <div
        onClick={() => scrollTo("skills")}
        className="absolute top-[20%] left-[25%] z-20 group cursor-pointer transition-transform duration-500 hover:scale-110"
        style={{ animation: "float-y 4s ease-in-out infinite" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-surface-variant backdrop-blur-xl border border-secondary/20 flex items-center justify-center shadow-[0_0_30px_rgba(0,251,251,0.2)]">
            <span className="material-symbols-outlined text-secondary text-2xl">terminal</span>
          </div>
          <div className="text-center">
            <span className="font-headline text-[10px] tracking-widest text-secondary block">STATION 01</span>
            <h3 className="font-headline text-lg font-bold text-on-surface">Skills</h3>
          </div>
        </div>
      </div>

      {/* Planet 2: Projects */}
      <div
        onClick={() => scrollTo("projects")}
        className="absolute bottom-[25%] right-[20%] z-20 group cursor-pointer transition-transform duration-500 hover:scale-110"
        style={{ animation: "float-xy 5s ease-in-out infinite" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-surface-variant backdrop-blur-xl border border-primary/20 flex items-center justify-center shadow-[0_0_30px_rgba(204,151,255,0.2)]">
            <span className="material-symbols-outlined text-primary text-3xl">deployed_code</span>
          </div>
          <div className="text-center">
            <span className="font-headline text-[10px] tracking-widest text-primary block">STATION 02</span>
            <h3 className="font-headline text-lg font-bold text-on-surface">Projects</h3>
          </div>
        </div>
      </div>

      {/* Planet 3: About Me */}
      {/* <div onClick={() => scrollTo("about")} className="absolute top-[35%] right-[25%] z-20 group cursor-pointer transition-transform duration-500 hover:scale-110">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-surface-variant backdrop-blur-xl border border-tertiary/20 flex items-center justify-center shadow-[0_0_30px_rgba(255,81,250,0.2)]">
            <span className="material-symbols-outlined text-tertiary text-xl">fingerprint</span>
          </div>
          <div className="text-center">
            <span className="font-headline text-[10px] tracking-widest text-tertiary block">STATION 03</span>
            <h3 className="font-headline text-lg font-bold text-on-surface">About Me</h3>
          </div>
        </div>
      </div> */}

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 flex flex-col items-center gap-3" style={{ animation: "scroll-fade 2s ease-in-out infinite" }}>
        <span className="font-label text-[9px] tracking-[0.3em] text-on-surface-variant uppercase">
          Scroll to Explore
        </span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-primary to-transparent" />
      </div>
    </section>
  );
}
