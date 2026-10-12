import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import PageIntro from "../../components/PageIntro";
import CTASection from "../../components/CTASection";
import WhyChooseUs from "../../components/WhyChooseUs";
import Reveal from "../../components/Reveal";
export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet CREWVERSE, a next-generation event staffing, entertainment and film workforce solutions company. Discover our purpose, vision and mission.",
};
export default function About() {
  return (
    <>
      <PageIntro
        eyebrow="THE PEOPLE BEHIND THE MOMENT"
        title={
          <>
            GREAT EXPERIENCES.
            <br />
            <span>START WITH PEOPLE.</span>
          </>
        }
        description="We connect organizers, production houses and businesses with the talent, skilled crews and workforce support behind every successful production."
      />
      <div className="container about-banner">
        <Image
          src="/images/concert.webp"
          alt="An audience celebrating a live event beneath confetti"
          fill
          priority
          sizes="100vw"
        />
        <div>
          <span>OUR PURPOSE</span>
          <h2>
            Right people.
            <br />
            Right roles.
            <br />
            Right time.
          </h2>
        </div>
      </div>
      <section className="section container story-grid">
        <Reveal>
          <p className="eyebrow">
            <span />
            WHO WE ARE
          </p>
          <h2>
            YOUR WORKFORCE.
            <br />
            <span>WORKING TOGETHER.</span>
          </h2>
        </Reveal>
        <Reveal>
          <p>
            CREWVERSE is a next-generation event staffing, entertainment and
            manpower solutions company. Our work brings together professionals
            across hospitality, entertainment, film production and skilled
            operational support.
          </p>
          <p>
            We simplify the way event and movie organizers find, manage and
            deploy manpower: the right people, for the right role, at the right
            time.
          </p>
          <Link href="/services" className="text-link">
            Explore our crew solutions <ArrowUpRight size={19} />
          </Link>
        </Reveal>
      </section>
      <section className="problem-section">
        <div className="container problem-grid">
          <Reveal>
            <p className="eyebrow">
              <span />
              THE CHALLENGE
            </p>
            <h2>
              LESS COMPLEXITY.
              <br />
              <span>MORE CLARITY.</span>
            </h2>
            <p>
              Finding dependable teams takes time. Last-minute cancellations,
              multiple vendors and inconsistent staffing quality make
              coordination harder than it needs to be.
            </p>
          </Reveal>
          <Reveal className="solution-panel">
            <span>THE CREWVERSE APPROACH</span>
            <h3>
              One conversation.
              <br />A coordinated crew.
            </h3>
            <p>
              We bring staffing requirements together through a single workforce
              partner. Discuss the talent, support and production roles you
              need, and coordinate your requirements with CREWVERSE.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="section container vision-grid">
        <Reveal className="vision-card">
          <span>01 / OUR VISION</span>
          <h2>
            THE NETWORK
            <br />
            OF <em>TOMORROW.</em>
          </h2>
          <p>
            To become India’s most trusted and comprehensive event and film
            workforce network, connecting businesses and organizers with the
            right talent, skilled crews and unique entertainment experiences.
          </p>
        </Reveal>
        <Reveal className="mission-card">
          <span>02 / OUR MISSION</span>
          <h2>
            RELIABILITY.
            <br />
            SPEED. <em>PEOPLE.</em>
          </h2>
          <p>
            Deliver exceptional manpower solutions with speed, reliability and
            professionalism, while expanding a skilled workforce community
            across major cities.
          </p>
          <div className="future-goal">
            <strong>50,000+</strong>
            <div>
              VERIFIED PROFESSIONALS
              <small>
                A future workforce community goal stated in the company profile,
                not a current workforce count.
              </small>
            </div>
          </div>
        </Reveal>
      </section>
      <WhyChooseUs />
      <CTASection />
    </>
  );
}
