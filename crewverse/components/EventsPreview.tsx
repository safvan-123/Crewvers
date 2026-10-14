import Link from "next/link";
import {ArrowUpRight} from "lucide-react";
import {getEvents} from "../lib/cms";
import EventCards from "./EventCards";
export default async function EventsPreview() {
 const events = await getEvents();
 return <section id="events" className="section reference-events"><div className="container"><div className="section-heading"><div><p className="eyebrow">EVENTS & UPDATES</p><h2>What’s Happening</h2></div><Link href="/events" className="text-link">View Events <ArrowUpRight size={17}/></Link></div>
 {events.length ? <EventCards events={events.slice(0,3)}/> : <div className="empty-events"><p>New events will appear here when announced.</p><Link href="/contact" className="text-link">Planning an event? Talk to us <ArrowUpRight size={16}/></Link></div>}
 </div></section>;
}
