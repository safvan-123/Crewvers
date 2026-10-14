import Link from "next/link";
import PageIntro from "../components/PageIntro";
export default function NotFound() {
  return <><PageIntro eyebrow="CREWVERSE" title={<>This page is <span>unavailable.</span></>} description="It may not be published, or the link may have changed."/><section className="section container"><div className="hero-actions"><Link href="/events" className="button yellow">Browse Events</Link><Link href="/" className="button outline">Back to Home</Link></div></section></>;
}
