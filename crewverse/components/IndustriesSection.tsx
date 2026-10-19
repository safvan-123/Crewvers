import Image from "next/image";
import { industries } from "../lib/content";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Reveal from "./Reveal";
export default function IndustriesSection() {
  return (
    <section id="industries" className="industries-section">
      <div className="container industries-layout">
        <Reveal>
          <p className="eyebrow">
            <span />
            WHERE WE FIT
          </p>
          <h2>
            BUILT FOR THE
            <br />
            INDUSTRIES THAT
            <br />
            <span>
              BRING PEOPLE
              <br />
              TOGETHER.
            </span>
          </h2>
          <p>
            From a guest’s first welcome to the final take, CREWVERSE supports
            the teams behind events, entertainment and productions.
          </p>
          <Link href="/contact" className="text-link">
            Tell us what you’re planning <ArrowUpRight size={19} />
          </Link>
        </Reveal>
        <div className="industry-content">
          <div className="industry-photo">
            <Image
              src="/images/event.webp"
              alt="Professionally prepared event and hospitality venue"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="industry-list">
            {industries.map((t, i) => (
              <div key={t}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
