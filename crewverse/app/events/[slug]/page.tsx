import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import SiteImage from "../../../components/SiteImage";
import {getEvents, eventDate} from "../../../lib/cms";
import {pageMetadata} from "../../../lib/seo";
export const dynamicParams = false;
export async function generateStaticParams() {
 const events = await getEvents();
 // A reserved missing path lets static export build even before the first event.
 // It renders notFound(), is never linked and never enters the sitemap.
 return events.length ? events.map(event => ({slug: event.slug})) : [{slug: "no-published-events"}];
}
export async function generateMetadata({params}: {params: Promise<{slug: string}>}): Promise<Metadata> {
 const {slug} = await params; const event = (await getEvents()).find(e => e.slug === slug);
 return event ? pageMetadata(event.title, event.summary || `Event details for ${event.title}.`, `/events/${slug}/`, event.cover?.url || "/images/concert.webp") : {title:"Event Unavailable", robots:{index:false,follow:false}};
}
export default async function EventDetail({params}: {params: Promise<{slug: string}>}) {
 const {slug} = await params; const event = (await getEvents()).find(e => e.slug === slug);
 if (!event) notFound();
 return <article className="container event-detail-page"><Link href="/events" className="text-link">← All Events</Link><p className="eyebrow">CREWVERSE EVENT</p><h1>{event.title}</h1><p className="event-summary">{event.summary}</p>
 <div className="event-facts"><div><strong>When</strong><time dateTime={event.startDate}>{eventDate(event.startDate)}</time>{event.endDate && <time dateTime={event.endDate}>Until {eventDate(event.endDate)}</time>}</div><div><strong>Where</strong><span>{[event.venue,event.city].filter(Boolean).join(", ")}</span></div></div>
 {event.cover?.url && <div className="event-detail-cover"><SiteImage image={event.cover} alt={event.cover.alt || event.title} priority/></div>}
 <div className="event-prose">{(event.details || "").split(/\n\s*\n/).map((paragraph,i)=><p key={i}>{paragraph}</p>)}</div>
 <Link href="/contact" className="button yellow">Enquire with CrewVerse</Link></article>;
}
