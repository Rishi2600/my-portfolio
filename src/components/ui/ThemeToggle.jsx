import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="theme-toggle"
    >
      <span key={theme} className="theme-toggle-icon">
        {isDark ? (
          <Moon size={16} strokeWidth={2} />
        ) : (
          <Sun size={16} strokeWidth={2} />
        )}
      </span>
    </button>
  );
}
