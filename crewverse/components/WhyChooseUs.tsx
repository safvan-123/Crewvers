import {
  Users,
  Timer,
  RefreshCw,
  BadgeCheck,
  ShieldCheck,
  SlidersHorizontal,
  MapPin,
  Network,
} from "lucide-react";
import { advantages } from "../lib/content";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
const icons = [
  Users,
  Timer,
  RefreshCw,
  BadgeCheck,
  ShieldCheck,
  SlidersHorizontal,
  MapPin,
  Network,
];
export default function WhyChooseUs() {
  return (
    <section className="section container">
      <SectionHeading
        eyebrow="WHY CREWVERSE"
        text="Fewer moving parts. A clearer conversation. A staffing partner built around your requirements."
      >
        YOUR EVENT. OUR PEOPLE.
        <br />
        <span>ONE SEAMLESS EXPERIENCE.</span>
      </SectionHeading>
      <div className="advantages-grid">
        {advantages.map((a, i) => {
          const Icon = icons[i];
          return (
            <Reveal className="advantage" key={a.title}>
              <div className="advantage-top">
                <Icon size={24} strokeWidth={1.4} />
                <span>0{i + 1}</span>
              </div>
              <h3>{a.title}</h3>
              <p>{a.text}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
