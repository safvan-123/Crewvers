import {pageMetadata} from "../../lib/seo";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Plus, Check } from "lucide-react";
import {getWebsite} from "../../lib/cms";
import PageIntro from "../../components/PageIntro";
import CTASection from "../../components/CTASection";
import Reveal from "../../components/Reveal";
export const metadata = pageMetadata('Crew Services in Kerala', 'Explore event staffing, Music Bands, Kerala fusion and traditional arts, cultural artists and film production workforce services.', '/services/');
export default async function Services() {
  const {services} = await getWebsite();
  return (
    <>
      <PageIntro
        eyebrow="THE CREWVERSE SERVICE LINEUP"
        title={
          <>
            EVERY ROLE.
            <br />
            <span>THE RIGHT PEOPLE.</span>
          </>
        }
        description="From front-of-house hospitality to behind-the-scenes production. Explore the people and expertise you can bring together with CREWVERSE."
      />
      <div className="container service-jump-links">
        {services.map((s) => (
          <a href={`#${s.id}`} key={s.id}>
            {s.number} / {s.title} <ArrowUpRight size={15} />
          </a>
        ))}
      </div>
      <div className="container service-detail-list">
        {services.map((s) => (
          <section id={s.id} className="service-detail" key={s.id}>
            <Reveal className="service-detail-photo">
              <Image
                src={s.image}
                alt={s.alt}
                fill
                sizes="(max-width:768px) 100vw, 45vw"
              />
              <span>{s.number} / THE LINEUP</span>
            </Reveal>
            <Reveal className="service-detail-copy">
              <p className="eyebrow">
                <span />
                CREWVERSE SERVICES
              </p>
              <h2>{s.title}</h2>
              <p>{s.description}</p>
              <details className="roles-accordion" open>
                <summary>
                  Explore available roles <Plus size={18} />
                </summary>
                <ul>
                  {s.roles.map((role) => (
                    <li key={role}>
                      <Check size={14} />
                      {role}
                    </li>
                  ))}
                </ul>
              </details>
              <Link
                href={`/contact/?service=${s.id}`}
                className="button yellow"
              >
                Enquire About This Crew <ArrowUpRight size={18} />
              </Link>
            </Reveal>
          </section>
        ))}
      </div>
      <CTASection />
    </>
  );
}
