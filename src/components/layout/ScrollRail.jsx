import { useEffect, useRef, useState } from "react";
import { RAIL_SECTIONS } from "../../data/railSections";

/**
 * A single line that runs the length of the viewport with a moving
 * marker, plus ticks for each section — the literal thing that "joins"
 * the page together, rather than each section reading as a separate
 * stacked screen. Desktop only (see index.css: `.rail { ... }`).
 */
export default function ScrollRail() {
  const dotRef = useRef(null);
  const [active, setActive] = useState("top");

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (dotRef.current) dotRef.current.style.top = `${p * 100}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers = RAIL_SECTIONS.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { threshold: 0, rootMargin: "-45% 0px -45% 0px" }
      );
      observer.observe(el);
      return observer;
    });
    return () => observers.forEach((o) => o && o.disconnect());
  }, []);

  return (
    <div className="rail hidden lg:flex">
      <div className="rail-track">
        <div ref={dotRef} className="rail-dot" />
      </div>
      <div className="rail-ticks">
        {RAIL_SECTIONS.map(({ id, label }) => (
          <a key={id} href={`#${id}`} className={`rail-tick ${active === id ? "is-active" : ""}`}>
            <span className="rail-tick-mark" />
            <span className="rail-tick-label font-mono">{label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
