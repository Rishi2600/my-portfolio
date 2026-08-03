import { useTilt } from "../../hooks/useTilt";

export default function TiltCard({ className = "", children, ...rest }) {
  const { ref, onMouseMove, onMouseLeave } = useTilt();
  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`tilt-card ${className}`}
      {...rest}
    >
      <div className="tilt-card-glow" />
      <div className="tilt-card-content">{children}</div>
    </div>
  );
}
