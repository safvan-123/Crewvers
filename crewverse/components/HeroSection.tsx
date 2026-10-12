import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ArrowDown } from "lucide-react";
import Reveal from "./Reveal";
export default function HeroSection() {
  return (
    <section className="hero">
      <Image
        src="/images/concert.webp"
        alt="Concert audience beneath stage lights and confetti"
        fill
        priority
        sizes="100vw"
        className="hero-photo"
      />
      <div className="hero-overlay" />
      <div className="container hero-content">
        <Reveal>
          <p className="eyebrow hero-eyebrow">
            <span />
            EVENT STAFFING · ENTERTAINMENT · FILM PRODUCTION
          </p>
          <h1>
            POWERING
            <br />
            EVERY EVENT.
            <br />
            <span>
              WITH THE
              <br />
              RIGHT CREW.
            </span>
          </h1>
          <div className="hero-details">
            <p>
              From live events to the silver screen. We bring the right
              professionals together to make every production run smoothly.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="button yellow">
                Hire Your Crew <ArrowRight size={18} />
              </Link>
              <Link href="/services" className="button outline">
                Explore Our Services <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </Reveal>
        <div className="hero-bottom">
          <a href="#the-crew" className="scroll-cue">
            <ArrowDown size={16} /> Meet the people behind the moment
          </a>
          <span>EVENTS / ENTERTAINMENT / FILM</span>
        </div>
      </div>
      <div className="hero-index">
        <span>EVERY ROLE.</span>
        <span>EVERY PRODUCTION.</span>
        <strong>ONE CREWVERSE.</strong>
      </div>
    </section>
  );
}
