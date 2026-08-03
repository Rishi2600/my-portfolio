import { useRef } from "react";

/** Nudges an element toward the cursor on hover, springs back on leave. */
export function useMagnetic(strength = 0.35) {
  const ref = useRef(null);

  const onMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
  };

  return { ref, onMouseMove, onMouseLeave };
}
