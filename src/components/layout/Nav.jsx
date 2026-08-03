import { useEffect, useState } from "react";

const LINKS = [
  ["About", "#about"],
  ["Work", "#work"],
  ["Skills", "#skills"],
  ["Contact", "#contact"],
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "nav-scrolled" : ""}`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between h-20">
        <a href="#top" className="font-display text-xl tracking-tight" style={{ color: "var(--ink)" }}>
          Your Name<span style={{ color: "var(--amber-deep)" }}>.</span>
        </a>
        <nav className="hidden md:flex items-center gap-9 font-mono text-xs uppercase tracking-widest">
          {LINKS.map(([label, href]) => (
            <a key={href} href={href} className="nav-link">
              {label}
            </a>
          ))}
        </nav>
        <a href="#contact" className="btn-ghost hidden md:inline-flex">
          Say hello
        </a>
      </div>
    </header>
  );
}
