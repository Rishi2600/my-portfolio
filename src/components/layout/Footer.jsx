export default function Footer() {
  return (
    <footer
      className="max-w-6xl mx-auto px-6 md:px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs"
      style={{ color: "var(--muted)" }}
    >
      <span>© {new Date().getFullYear()} Rishi.</span>
      <span>Built with React &amp; Three.js.</span>
    </footer>
  );
}
