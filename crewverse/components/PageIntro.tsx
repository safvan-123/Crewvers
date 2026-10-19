import { ReactNode } from "react";

export default function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
}) {
  return (
    <section className="page-intro container">
      <div className="page-intro-content">
        <p className="eyebrow">
          <span />
          {eyebrow}
        </p>

        <h1>{title}</h1>

        <p className="intro-description">{description}</p>
      </div>
    </section>
  );
}