import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import Reveal from "./Reveal";
export default function AboutPreview() {
  return (
    <section id="the-crew" className="section container about-preview">
      <Reveal className="about-photo">
        <Image
          src="/images/film.webp"
          alt="Behind-the-scenes film production clapperboard"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="photo-note">
          <span>BEHIND EVERY GREAT MOMENT</span>
          <strong>There’s a great crew.</strong>
        </div>
        <span className="vertical-note">THE PEOPLE MAKE THE DIFFERENCE</span>
      </Reveal>
      <Reveal className="about-copy">
        <p className="eyebrow">
          <span />
          MEET CREWVERSE
        </p>
        <h2>
          THE PEOPLE
          <br />
          BEHIND EVERY
          <br />
          <span>GREAT EVENT.</span>
        </h2>
        <p>
          We’re a next-generation event staffing, entertainment and workforce
          solutions company. We connect organizers, production houses and
          businesses with skilled professionals for the work behind the
          experience.
        </p>
        <div className="about-highlights">
          {[
            "Event & hospitality professionals",
            "Entertainment & cultural talent",
            "Film crews & crowd manpower",
          ].map((t) => (
            <div key={t}>
              <Check size={16} />
              {t}
            </div>
          ))}
        </div>
        <Link href="/about" className="text-link">
          More About CREWVERSE <ArrowUpRight size={19} />
        </Link>
      </Reveal>
    </section>
  );
}
