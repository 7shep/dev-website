import { useReveal } from "../hooks/useReveal";

export default function About() {
  const { ref, isVisible } = useReveal();

  return (
    <section id="about" className="min-h-screen px-6 md:px-24 py-32 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full" ref={ref}>
        <div className={`mb-16 reveal${isVisible ? " visible" : ""}`}>
          <h2 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter text-on-surface">
            ABOUT
          </h2>
          <div className="w-24 md:w-48 h-2 bg-tertiary mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className={`lg:col-span-2 space-y-6 reveal${isVisible ? " visible" : ""}`}>
            <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed font-body">
              My name is Alex. I'm a 19-year-old student studying Computing with a sub-plan in Artificial Intelligence at Queen's University in Kingston, Ontario.
            </p>
            <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed font-body">
              In my free time I enjoy anything sport-related, and coding side projects that make my life more productive.
            </p>
            <a
              href="/assets/Alex_Shepherd_Resume.pdf"
              download
              className="inline-flex items-center gap-3 mt-4 border border-tertiary/40 rounded-full px-6 py-3 font-headline font-bold tracking-[0.3em] text-xs text-on-surface hover:border-tertiary hover:shadow-[0_0_20px_rgba(255,81,250,0.15)] transition-all duration-300"
            >
              <span className="material-symbols-outlined text-tertiary text-base">download</span>
              DOWNLOAD RESUME
            </a>
          </div>

          <div className={`space-y-4 reveal reveal-delay-1${isVisible ? " visible" : ""}`}>
            <div className="bg-surface-container-high/40 backdrop-blur-md border border-tertiary/10 rounded-2xl p-6">
              <span className="block text-[9px] font-label text-tertiary tracking-[0.3em] uppercase mb-2">
                Location
              </span>
              <p className="font-headline text-lg text-on-surface">
                Elora, Ontario
              </p>
            </div>
            <div className="bg-surface-container-high/40 backdrop-blur-md border border-tertiary/10 rounded-2xl p-6">
              <span className="block text-[9px] font-label text-tertiary tracking-[0.3em] uppercase mb-2">
                Studying
              </span>
              <p className="font-headline text-lg text-on-surface">
                Computing + AI
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                Queen's University
              </p>
            </div>
            <div className="bg-surface-container-high/40 backdrop-blur-md border border-tertiary/10 rounded-2xl p-6">
              <span className="block text-[9px] font-label text-tertiary tracking-[0.3em] uppercase mb-2">
                Interests
              </span>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Sports, side projects, productivity tools.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
