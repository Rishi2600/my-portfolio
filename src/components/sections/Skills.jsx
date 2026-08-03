import Reveal from "../ui/Reveal";
import { SKILLS } from "../../data/skills";

export default function Skills() {
  return (
    <section id="skills" className="section-flow">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-24 md:py-32">
        <Reveal className="font-mono text-xs uppercase tracking-[0.25em] mb-5" style={{ color: "var(--clay)" }}>
          What I work with
        </Reveal>
        <Reveal delay={1}>
          <h2 className="font-display text-3xl md:text-4xl mb-12 max-w-xl">
            A toolkit built for clean code and considered detail.
          </h2>
        </Reveal>
        <div className="flex flex-wrap gap-3">
          {SKILLS.map(({ label, icon: Icon }, i) => (
            <Reveal key={label} delay={(i % 3) + 1} className="skill-chip">
              <Icon size={15} strokeWidth={2} />
              {label}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
