import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "../ui/BrandIcons";
import Reveal from "../ui/Reveal";
import TiltCard from "../ui/TiltCard";
import { PROJECTS } from "../../data/projects";

export default function Projects() {
  return (
    <section id="work" className="max-w-6xl mx-auto px-6 md:px-10 py-28 md:py-36">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <div>
          <Reveal className="font-mono text-xs uppercase tracking-[0.25em] mb-5" style={{ color: "var(--clay)" }}>
            Selected work
          </Reveal>
          <Reveal delay={1}>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">My work.</h2>
          </Reveal>
        </div>
        <Reveal delay={2} className="max-w-sm text-sm" style={{ color: "var(--muted)" }}>
          A product of my own, a CRM running in production, the site for my
          studio, and one built purely for the fun of it. Every one of them is
          live, and the source is open.
        </Reveal>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {PROJECTS.map((project, i) => (
          <Reveal key={project.id} delay={(i % 3) + 1}>
            <TiltCard className="project-card">
              <div className="flex items-start justify-between gap-4 mb-7">
                <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--clay)" }}>
                  {project.kind}
                </span>
                <span className="project-plus" aria-hidden="true">
                  <ArrowUpRight size={16} strokeWidth={2} />
                </span>
              </div>

              <h3 className="font-display text-2xl mb-3">{project.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {project.description}
              </p>

              <ul className="project-stack">
                {project.stack.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>

              <div className="project-links">
                <a href={project.live} target="_blank" rel="noreferrer noopener">
                  Live site
                  <ArrowUpRight size={14} strokeWidth={2} />
                </a>
                <a href={project.code} target="_blank" rel="noreferrer noopener">
                  <GithubIcon size={14} strokeWidth={2} />
                  Code
                </a>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
