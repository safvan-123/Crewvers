import Link from "next/link";
import {ArrowUpRight, Mic, Camera, Users, Martini, Megaphone, AudioLines, ShieldCheck, Sparkles, Clapperboard, HardHat} from "lucide-react";
import Reveal from "./Reveal";
import SiteImage from "./SiteImage";
import {getWebsite} from "../lib/cms";
const icons: Record<string, typeof Mic> = {mic:Mic, camera:Camera, users:Users, martini:Martini, megaphone:Megaphone, audio:AudioLines, shield:ShieldCheck, sparkles:Sparkles, clapperboard:Clapperboard, hardhat:HardHat};
export default async function ServicesGrid() {
  const {services, servicePreviews} = await getWebsite();
  const entertainment = services.find(s => s.id === "entertainment")!;
  return <section id="services-preview" className="section service-section compact-services"><div className="container">
    <div className="section-heading"><div><p className="eyebrow">OUR SERVICES</p><h2>Complete Crew Solutions</h2><p className="compact-intro">The right people for your event, performance or production.</p></div><Link href="/services" className="text-link">View All Services <ArrowUpRight size={17}/></Link></div>
    <div className="reference-services-grid">{servicePreviews.map(({key,title,groupId,image,icon,short,alt},i) => {
      const Icon = icons[icon] || Mic;
      return <Reveal key={key} delay={(i % 5)*0.025}><Link href={`/services/#${groupId}`} className="reference-service-card">
        <SiteImage image={image} alt={alt} sizes="(max-width: 480px) 100vw, (max-width: 900px) 50vw, 240px"/>
        <div className="reference-service-copy"><Icon size={25}/><h3>{title}</h3><p>{short}</p><ArrowUpRight className="card-corner" size={16}/></div>
      </Link></Reveal>;
    })}</div>
    <p className="entertainment-note">Entertainment options include {entertainment.roles.join(" · ")}</p>
  </div></section>;
}
