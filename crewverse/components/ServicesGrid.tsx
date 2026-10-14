import Link from "next/link";
import {ArrowUpRight, Mic, Camera, Users, Martini, Megaphone, AudioLines, ShieldCheck, Sparkles, Clapperboard, HardHat} from "lucide-react";
import Reveal from "./Reveal";
import SiteImage from "./SiteImage";
import {getWebsite} from "../lib/cms";
const categories = [
  {title:"Singers, Rappers & Dancers", id:"entertainment", image:"performer", Icon:Mic},
  {title:"Photography & Videography", id:"entertainment", image:"film", Icon:Camera},
  {title:"Event Support Staff", id:"event-staffing", image:"event", Icon:Users},
  {title:"Bartenders & Food Service", id:"event-staffing", image:"event", Icon:Martini},
  {title:"Promoters & Brand Activations", id:"event-staffing", image:"crew", Icon:Megaphone},
  {title:"Emcees & Hostesses", id:"entertainment", image:"crew", Icon:AudioLines},
  {title:"Bouncers & Security", id:"event-staffing", image:"event", Icon:ShieldCheck},
  {title:"Cultural Artists", id:"culture-workforce", image:"culture", Icon:Sparkles},
  {title:"Film & Production Crew", id:"film-production", image:"film", Icon:Clapperboard},
  {title:"Skilled Labour & Setup", id:"culture-workforce", image:"event", Icon:HardHat},
];
export default async function ServicesGrid() {
  const {services} = await getWebsite();
  const entertainment = services.find(s => s.id === "entertainment")!;
  return <section id="services-preview" className="section service-section compact-services"><div className="container">
    <div className="section-heading"><div><p className="eyebrow">OUR SERVICES</p><h2>Complete Crew Solutions</h2><p className="compact-intro">The right people for your event, performance or production.</p></div><Link href="/services" className="text-link">View All Services <ArrowUpRight size={17}/></Link></div>
    <div className="reference-services-grid">{categories.map(({title,id,image,Icon},i) => {
      const group = services.find(s => s.id === id)!;
      return <Reveal key={title} delay={(i % 5)*0.025}><Link href={`/services/#${id}`} className="reference-service-card">
        <SiteImage image={`/images/${image}.webp`} alt={group.alt} sizes="(max-width: 480px) 100vw, (max-width: 900px) 50vw, 240px"/>
        <div className="reference-service-copy"><Icon size={25}/><h3>{title}</h3><p>{group.short}</p><ArrowUpRight className="card-corner" size={16}/></div>
      </Link></Reveal>;
    })}</div>
    <p className="entertainment-note">Entertainment options include {entertainment.roles.join(" · ")}</p>
  </div></section>;
}
