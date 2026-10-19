import Image from "next/image";
import CrewLink from "./CrewLink";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {getWebsite} from "../lib/cms";
export default async function Footer() {
  const {company, services} = await getWebsite();
  return (
    <>
      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-intro">
            <Link href="/" aria-label="Crewverse home">
              <Image
                src="/images/logo.webp"
                alt="CREWVERSE — Right Crew, Right Events, Right Time"
                width={1754}
                height={419}
                sizes="220px"
              />
            </Link>
            <p>
              The people behind your next great event, performance and
              production.
            </p>
            <span className="footer-tagline">{company.tagline}</span>
          </div>
          <div>
            <h3>EXPLORE</h3>
            {[
              ["/", "Home"],
              ["/about", "About Us"],
              ["/services", "Services"],
              ["/events", "Events"],
              ["/contact", "Get a Crew"],
            ].map(([h, t]) => (
              t === "Get a Crew" ? <CrewLink key={h}>{t}</CrewLink> : <Link href={h} key={h}>{t}</Link>
            ))}
          </div>
          <div>
            <h3>OUR CREW</h3>
            {services.map((s) => (
              <Link href={`/services/#${s.id}`} key={s.id}>
                {s.title}
              </Link>
            ))}
          </div>
          <div className="footer-contact">
            <h3>LET’S CONNECT</h3>
            <a href={company.phoneHref}>
              {company.phone} <ArrowUpRight size={15} />
            </a>
            <a href={`mailto:${company.email}`}>
              {company.email} <ArrowUpRight size={15} />
            </a>
            <p>
              Share your event or production requirements. We’ll discuss the
              right crew.
            </p>
          </div>
        </div>
        <nav className="container policy-links" aria-label="Booking policies">
          <Link href="/terms">Terms &amp; Conditions</Link>
          <Link href="/payment-policy">Payment Policy</Link>
          <Link href="/cancellation-refund-policy">Cancellation &amp; Refund Policy</Link>
          <Link href="/safety-liability-policy">Safety &amp; Liability Policy</Link>
        </nav>
        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} CREWVERSE. All rights reserved.
          </span>
          <span>Events. Entertainment. Film.</span>
        </div>
      </footer>
      <CrewLink className="mobile-booking">
        GET A CREW <ArrowUpRight size={18} />
      </CrewLink>
    </>
  );
}
