import { process } from "../lib/content";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
export default function ProcessSection() {
  return (
    <section className="section container">
      <SectionHeading
        eyebrow="LET’S MAKE IT HAPPEN"
        text="A straightforward conversation to turn your requirements into a coordinated crew plan."
      >
        FROM YOUR VISION.
        <br />
        <span>TO THE RIGHT PEOPLE.</span>
      </SectionHeading>
      <div className="process-grid">
        {process.map((s, i) => (
          <Reveal key={s.title} className="process-step">
            <span className="step-number">0{i + 1}</span>
            <div className="step-rule" />
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
