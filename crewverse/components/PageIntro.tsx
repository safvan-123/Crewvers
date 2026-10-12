import { ReactNode } from "react";
import Reveal from "./Reveal";
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
      <Reveal>
        <p className="eyebrow">
          <span />
          {eyebrow}
        </p>
        <h1>{title}</h1>
        <p className="intro-description">{description}</p>
      </Reveal>
    </section>
  );
}
