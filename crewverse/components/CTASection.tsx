import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export default function CTASection() {
  return (
    <section className="cta-section">
      <div className="container cta-layout">
        <div>
          <p className="eyebrow">
            <span />
            YOUR NEXT GREAT MOMENT STARTS HERE
          </p>
          <h2>
            GREAT EVENTS
            <br />
            DON’T HAPPEN <em>ALONE.</em>
          </h2>
          <p>
            Let’s bring the right people together for your next event or
            production.
          </p>
        </div>
        <Link
          href="/contact"
          className="cta-orbit"
          aria-label="Let's Talk Crew"
        >
          <ArrowUpRight size={44} strokeWidth={1.2} />
          <span>LET’S TALK CREW</span>
        </Link>
      </div>
    </section>
  );
}
