import { useReveal } from "../hooks/useReveal";

type Project = {
  category: string;
  title: string;
  image: string;
  alt: string;
};

const projects: Project[] = [
  {
    category: "Discord Analytics Bot",
    title: "Project: Andromeda",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC7ExTQHtu5yz2rZv8Jl_e41eTz6qxdi9cXIPM1SL8moijLe2SoXxGqvkhCEcuxGmPlhKkPnMR5N7Lk7UQcs_r3gOmUOFO5az7hf17WQixIulTIoBYMYQvVL8FlUw6g_i79hbZR1danf4VlWZ-Vqr4-bqw1vx27R4VE5_B1jqYoxG149XuYZgyFcJU8sgG8g9Ks_-4r8ixSFXIWN8IvRldytlapRoVcPr2Q0dWU-V3a4tV3RNtyQ3XKW5YSheL9_Fd3aWlqXoGH0nvD",
    alt: "abstract technological interface with glowing circuits",
  },
  {
    category: "Queens Web Development Club",
    title: "Project: ./education/",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBIOFAIfiA0TyrCZWLw55VFcBY4PKr3535bJYAb4m0EelNx8LZ4FDvCfByg13SadPv-YL3n-XMIr-x2CNNodvAnkNnQvHh2qeTo-jwmBWQmw9g7me5lMskTdr3GyWIzbedS0Fa60we9FBCoaxhoCwAeI9VfQu4rRE9_7M61gpiG7ghS0uO74BykpLH24nEkZhqPldztZVzYXiHDz988ewUMumbDz78waNrSmAXFT8tUxUgxZPmxoBXwjzFguB8PGrvPNmhqm9Zp8fJ",
    alt: "visualization of complex mathematical geometry with glowing golden lines",
  },
];

export default function Projects() {
  const { ref, isVisible } = useReveal();

  return (
    <section id="projects" className="min-h-screen px-12 md:px-32 py-32">
      <div className="text-right mb-24" ref={ref}>
        <h2 className={`text-5xl md:text-7xl font-headline font-bold mt-6 reveal${isVisible ? " visible" : ""}`}>
          Digital <span className="text-primary">Constellations</span>.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {projects.map((project, i) => (
          <div
            key={project.title}
            className={`group relative overflow-hidden rounded-2xl bg-surface-container-highest aspect-video reveal${i > 0 ? " reveal-delay-1" : ""}${isVisible ? " visible" : ""}`}
          >
            <img
              className="w-full h-full object-cover opacity-40 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700"
              src={project.image}
              alt={project.alt}
              loading="lazy"
            />
            <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-surface-container-lowest to-transparent">
              <span className="text-[10px] font-label text-primary tracking-widest uppercase mb-2">
                {project.category}
              </span>
              <h4 className="text-2xl font-headline font-bold text-on-surface mb-4">
                {project.title}
              </h4>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors">
                  link
                </span>
                <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors">
                  code
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
