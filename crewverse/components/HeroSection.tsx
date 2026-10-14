import Link from "next/link";
import {ArrowRight} from "lucide-react";
import Reveal from "./Reveal";
import SiteImage from "./SiteImage";
import {getWebsite} from "../lib/cms";
import imageData from "../lib/image-data.json";
export default async function HeroSection() {
  const data = await getWebsite();
  const localHero = "/images/concert-4k.webp" in imageData ? "/images/concert-4k.webp" : "/images/concert.webp";
  return <section className="hero reference-hero">
    <SiteImage image={data.heroImage || localHero} alt={data.heroImage?.alt || "Illustrative live event audience and stage lighting"} priority className="hero-photo" />
    <div className="hero-overlay" />
    <div className="container hero-content"><Reveal>
      <p className="eyebrow hero-eyebrow">CREWVERSE · KERALA</p>
      <h1>{data.heroTitle}<br /><span>{data.heroHighlight}</span></h1>
      <p className="reference-tagline">RIGHT CREW. RIGHT EVENT. RIGHT TIME.</p>
      <div className="hero-details"><p>{data.heroIntroduction}</p>
        <div className="hero-actions">
          <Link href="/services" className="button yellow">Explore Our Services <ArrowRight size={17}/></Link>
          <Link href="/contact" className="button outline">Get a Quote</Link>
        </div>
      </div>
    </Reveal></div>
  </section>;
}
