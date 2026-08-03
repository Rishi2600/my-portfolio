import { Plus } from "lucide-react";
import Reveal from "../ui/Reveal";
import TiltCard from "../ui/TiltCard";
import { PROJECTS } from "../../data/projects";

export default function Projects() {
  return (
    <section
      id="work"
      className="max-w-6xl mx-auto px-6 md:px-10 py-28 md:py-36"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <div>
          <Reveal
            className="font-mono text-xs uppercase tracking-[0.25em] mb-5"
            style={{ color: "var(--clay)" }}
          >
            Selected work
          </Reveal>
          <Reveal delay={1}>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">
              Projects, landing soon.
            </h2>
          </Reveal>
        </div>
        <Reveal
          delay={2}
          className="max-w-sm text-sm"
          style={{ color: "var(--muted)" }}
        >
          These four slots are placeholders for the design pass. Once the look
          is approved, real case studies — image, brief, outcome, link — will
          replace each card below.
        </Reveal>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {PROJECTS.map((project, i) => (
          <Reveal key={project.id} delay={(i % 3) + 1}>
            <TiltCard className="project-card">
              <div className="flex items-center justify-between mb-16">
                <span
                  className="font-mono text-xs tracking-widest"
                  style={{ color: "var(--clay)" }}
                >
                  PLACEHOLDER
                </span>
                <span className="project-plus">
                  <Plus size={16} strokeWidth={2} />
                </span>
              </div>
              <h3 className="font-display text-2xl mb-2">{project.title}</h3>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Case study coming soon.
              </p>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
