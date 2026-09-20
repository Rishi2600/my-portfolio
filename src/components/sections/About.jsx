import Reveal from "../ui/Reveal";

const FACTS = [
  ["Focus", "Full-stack web"],
  ["Stack", "TS · Go · Rust"],
];

export default function About() {
  return (
    <section id="about" className="max-w-3xl mx-auto px-6 md:px-10 py-28 md:py-36">
      <Reveal className="font-mono text-xs uppercase tracking-[0.25em] mb-5" style={{ color: "var(--clay)" }}>
        About
      </Reveal>
      <Reveal delay={1}>
        <h2 className="font-display text-4xl md:text-5xl leading-tight mb-6">
          I'd rather ship one thing that holds up than five that only demo well.
        </h2>
      </Reveal>
      <Reveal delay={2} className="space-y-4 text-base md:text-lg" style={{ color: "var(--muted)" }}>
        <p>
          I'm a full-stack developer. I work across JavaScript and TypeScript,
          Go, Rust and Python, but the thing I reach for first is Next.js on
          top of Postgres — and I'm as happy in the schema as I am in the CSS.
        </p>
        <p>
          Most of what I build is meant to survive contact with real users, so
          I care about the unglamorous parts: prices settled on the server
          rather than the browser, orders that keep a snapshot of what was
          bought, rate limits on the form nobody thinks about. Then, every so
          often, I write something with no build step at all just to keep the
          fundamentals sharp.
        </p>
      </Reveal>
      <Reveal delay={3} className="grid grid-cols-2 gap-5 mt-10 pt-8 fact-row">
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
