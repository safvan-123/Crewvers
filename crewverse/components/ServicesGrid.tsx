import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "../lib/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
export default function ServicesGrid() {
  return (
    <section className="section service-section">
      <div className="container">
        <SectionHeading
          eyebrow="WHAT WE DO"
          text="The right people. The right expertise. All the support your event or production needs."
        >
          THE RIGHT TALENT.
          <br />
          <span>FOR EVERY PRODUCTION.</span>
        </SectionHeading>
        <div className="services-grid">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={(i % 2) * 0.06}>
              <Link href={`/services/#${s.id}`} className="service-card">
                <Image
                  src={s.image}
                  alt={s.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="service-gradient" />
                <div className="service-card-top">
                  <span>{s.number} / CREWVERSE</span>
                  <span className="circle-arrow">
                    <ArrowUpRight size={22} />
                  </span>
                </div>
                <div className="service-card-copy">
                  <h3>{s.title}</h3>
                  <p>{s.short}</p>
                  <span className="service-discover">
                    Explore the crew <ArrowUpRight size={15} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="center-link">
          <Link href="/services" className="button outline">
            View All Services <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
