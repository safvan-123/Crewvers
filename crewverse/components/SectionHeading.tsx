import { ReactNode } from "react";
export default function SectionHeading({
  eyebrow,
  children,
  text,
}: {
  eyebrow: string;
  children: ReactNode;
  text?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">
          <span />
          {eyebrow}
        </p>
        <h2>{children}</h2>
      </div>
      {text && <p className="section-description">{text}</p>}
    </div>
  );
}
