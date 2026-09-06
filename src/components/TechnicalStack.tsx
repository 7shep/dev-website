const groups = [
  {
    title: "Interfaces",
    skills: "React / TypeScript / Next.js / Tailwind CSS / Expo / HTML",
  },
  {
    title: "Behind the scenes",
    skills: "Node.js / Python / Java / Express / Supabase / OAuth 2.0",
  },
  {
    title: "From idea to live",
    skills: "Git / Figma / Vercel / GitHub Actions / Railway / Windows",
  },
];
export default function TechnicalStack() {
  return (
    <section id="skills" className="stack-section wrap">
      <h2>The tools I build with.</h2>
      <div className="stack-groups">
        {groups.map((group) => (
          <div key={group.title}>
            <h3>{group.title}</h3>
            <p>{group.skills}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
