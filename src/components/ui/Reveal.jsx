import { useReveal } from "../../hooks/useReveal";

export default function Reveal({
  as: Tag = "div",
  delay = 0,
  className = "",
  children,
  ...rest
}) {
  const [ref, visible] = useReveal();
  const delayClass = delay ? `reveal-delay-${delay}` : "";

  return (
    <Tag
      ref={ref}
      className={`reveal ${delayClass} ${visible ? "is-visible" : ""} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
