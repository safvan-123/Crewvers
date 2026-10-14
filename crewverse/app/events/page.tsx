import PageIntro from "../../components/PageIntro";
import EventCards from "../../components/EventCards";
import Link from "next/link";
import {getEvents} from "../../lib/cms";
import {pageMetadata} from "../../lib/seo";
export const metadata = pageMetadata("Events & Updates", "Explore published CrewVerse events and updates. View dates, venues and event details.", "/events/");
export default async function Events() {
 const events = await getEvents();
 return <><PageIntro eyebrow="CREWVERSE EVENTS" title={<>Events &amp; <span>Updates</span></>} description="Dates, places and details. See what’s been announced."/>
 <section className="section container events-page">{events.length ? <EventCards events={events}/> : <div className="empty-events"><h2>More to come.</h2><p>No events have been announced yet.</p><Link href="/contact" className="button yellow">Discuss Your Event</Link></div>}</section></>;
}
