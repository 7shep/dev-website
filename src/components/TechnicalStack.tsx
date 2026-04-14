type SkillChip = { icon: string; label: string; fill?: boolean };

type SkillColumn = {
  icon: string;
  iconFill?: boolean;
  heading: string;
  color: string;
  borderColor: string;
  chipColor: string;
  skills: SkillChip[];
};

const columns: SkillColumn[] = [
  {
    icon: "pentagon",
    iconFill: true,
    heading: "FRONTEND_ENGINES",
    color: "text-secondary",
    borderColor: "border-secondary/10",
    chipColor: "text-secondary",
    skills: [
      { icon: "change_history", label: "React.js", fill: true },
      { icon: "share", label: "TypeScript" },
      { icon: "layers", label: "Next.js" },
      { icon: "grid_view", label: "TailwindCSS" },
      { icon: "motion_photos_on", label: "EXPO" },
      { icon: "timeline", label: "HTML" },
    ],
  },
  {
    icon: "database",
    iconFill: true,
    heading: "SUBSPACE_BACKENDS",
    color: "text-primary",
    borderColor: "border-primary/10",
    chipColor: "text-primary",
    skills: [
      { icon: "terminal", label: "Node.js" },
      { icon: "format_list_bulleted", label: "Supabase" },
      { icon: "hub", label: "Express" },
      { icon: "memory", label: "Python" },
      { icon: "shield", label: "OAuth 2.0" },
      { icon: "cloud", label: "Java" },
    ],
  },
  {
    icon: "build",
    iconFill: true,
    heading: "FORGE_EQUIPMENT",
    color: "text-tertiary",
    borderColor: "border-tertiary/10",
    chipColor: "text-tertiary",
    skills: [
      { icon: "folder", label: "Git" },
      { icon: "inventory_2", label: "Windows", fill: true },
      { icon: "person", label: "Figma" },
      { icon: "check_circle", label: "Vercel", fill: true },
      { icon: "code", label: "GitHub Actions" },
      { icon: "send", label: "Railway" },
    ],
  },
];

export default function TechnicalStack() {
  return (
    <section id="skills" className="min-h-screen px-6 md:px-24 py-32 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-16">
          <h2 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter text-on-surface">
            TECHNICAL_STACK
          </h2>
          <div className="w-24 md:w-48 h-2 bg-secondary mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {columns.map((col) => (
            <div key={col.heading} className="space-y-6">
              <div className="flex items-center gap-3">
                <span
                  className={`material-symbols-outlined ${col.color}`}
                  style={col.iconFill ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {col.icon}
                </span>
                <h3 className={`font-headline text-xl font-bold tracking-widest ${col.color}`}>
                  {col.heading}
                </h3>
              </div>
              <div
                className={`bg-surface-container-high/40 backdrop-blur-md border ${col.borderColor} rounded-2xl p-8 grid grid-cols-2 gap-4`}
              >
                {col.skills.map((skill) => (
                  <div
                    key={skill.label}
                    className="bg-surface-container-highest/60 p-4 rounded-lg flex items-center gap-3 border border-white/5"
                  >
                    <span
                      className={`material-symbols-outlined ${col.chipColor} text-sm`}
                      style={skill.fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      {skill.icon}
                    </span>
                    <span className="text-xs font-label text-on-surface-variant uppercase tracking-wider">
                      {skill.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
