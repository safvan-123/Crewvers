import Link from "next/link";
import {ArrowUpRight, CalendarDays} from "lucide-react";
import SiteImage from "./SiteImage";
import {CrewEvent, eventDate} from "../lib/cms";
export default function EventCards({events}: {events: CrewEvent[]}) {
 return <div className="events-grid">{events.map((event, i) => <article className="event-card" data-reveal-delay={(i % 3) * .08} key={event._id}>
   <Link href={`/events/${event.slug}/`} className="event-cover" aria-label={`Read ${event.title}`}>
     {event.cover?.url ? <SiteImage image={event.cover} alt={event.cover.alt || event.title} sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw"/> : <div className="event-image-placeholder"><CalendarDays size={38}/><span>CREWVERSE EVENT</span></div>}
   </Link>
   <div className="event-card-body"><p className="event-date"><time dateTime={event.startDate}>{eventDate(event.startDate)}</time></p><h3><Link href={`/events/${event.slug}/`}>{event.title}</Link></h3><p>{event.summary}</p><p className="event-location">{[event.venue,event.city].filter(Boolean).join(" · ")}</p><Link href={`/events/${event.slug}/`} className="text-link">View Details <ArrowUpRight size={16}/></Link></div>
 </article>)}</div>;
}
