import Reveal from "../ui/Reveal";

const FACTS = [
  ["Based in", "Delhi, India"],
  ["Focus", "Web & Interaction"],
  ["Currently", "Open to work"],
];

export default function About() {
  return (
    <section id="about" className="max-w-3xl mx-auto px-6 md:px-10 py-28 md:py-36">
      <Reveal className="font-mono text-xs uppercase tracking-[0.25em] mb-5" style={{ color: "var(--clay)" }}>
        About
      </Reveal>
      <Reveal delay={1}>
        <h2 className="font-display text-4xl md:text-5xl leading-tight mb-6">
          I like rooms with good light and interfaces with good pacing.
        </h2>
      </Reveal>
      <Reveal delay={2} className="space-y-4 text-base md:text-lg" style={{ color: "var(--muted)" }}>
        <p>
          This paragraph is a placeholder — swap it for a short, honest bio. A
          few sentences on how you got into building things, what kind of
          problems you enjoy, and the tools you reach for first.
        </p>
        <p>
          Mention a value or two that shapes your work — clarity, craft,
          curiosity — and back it up with a specific example once your
          project section is filled in.
        </p>
      </Reveal>
      <Reveal delay={3} className="grid grid-cols-3 gap-5 mt-10 pt-8 fact-row">
        {FACTS.map(([k, v]) => (
          <div key={k}>
            <div className="font-mono text-[11px] uppercase tracking-widest mb-1" style={{ color: "var(--clay)" }}>
              {k}
            </div>
            <div className="font-display text-lg">{v}</div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
