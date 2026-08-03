import { useRef } from "react";

/**
 * Attach to any element for a subtle 3D tilt that follows the cursor,
 * plus CSS vars (--glow-x/--glow-y) a child can use for a cursor-tracking
 * highlight. Pure DOM mutation (no React state) so it stays smooth.
 */
export function useTilt(strength = 10) {
  const ref = useRef(null);

  const onMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(700px) rotateX(${(-y * strength).toFixed(2)}deg) rotateY(${(
      x * strength
    ).toFixed(2)}deg) translateY(-4px)`;
    el.style.setProperty("--glow-x", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--glow-y", `${(y + 0.5) * 100}%`);
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
  };

  return { ref, onMouseMove, onMouseLeave };
}
