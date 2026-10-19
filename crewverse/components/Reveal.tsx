import { ReactNode } from "react";

// Visible in the server HTML. The shared controller enhances it after hydration.
export default function Reveal({children, className = "", delay = 0}: {
  children: ReactNode; className?: string; delay?: number;
}) {
  return <div className={className} data-reveal data-reveal-delay={delay}>{children}</div>;
}
