import Link from "next/link";
import {ArrowUpRight, Target, ShieldCheck, Users, Zap} from "lucide-react";
import Reveal from "./Reveal";
import SiteImage from "./SiteImage";
import {getWebsite} from "../lib/cms";
export default async function AboutPreview() {
 const data = await getWebsite();
 return <section id="the-crew" className="section container about-preview reference-about">
  <Reveal className="about-photo"><SiteImage image={data.aboutImage || "/images/film.webp"} alt={data.aboutImage?.alt || "Illustrative film production clapperboard"} sizes="(max-width: 768px) 100vw, 50vw"/></Reveal>
  <Reveal className="about-copy"><p className="eyebrow">ABOUT US</p><h2>More Than Just a Crew</h2><p>{data.aboutIntroduction}</p>
   <div className="reference-highlights">{[[Target,"Right Talent"],[ShieldCheck,"Reliable Coordination"],[Users,"Diverse Crew Roles"],[Zap,"Flexible Solutions"]].map(([Icon,title]: any) => <div key={title}><Icon size={24}/><span>{title}</span></div>)}</div>
   <Link href="/about" className="button yellow">Learn More <ArrowUpRight size={16}/></Link>
  </Reveal>
 </section>;
}
