import HeroSection from "../components/HeroSection";
import AboutPreview from "../components/AboutPreview";
import ServicesGrid from "../components/ServicesGrid";
import WhyChooseUs from "../components/WhyChooseUs";
import IndustriesSection from "../components/IndustriesSection";
import ProcessSection from "../components/ProcessSection";
import EventsPreview from "../components/EventsPreview";
import HomeContact from "../components/HomeContact";
import {pageMetadata} from "../lib/seo";
export const metadata = pageMetadata("Event Staff & Entertainment in Kerala", "Find event staff, performers, Music Bands, Kerala traditional artists and film production crews with CrewVerse. Enquire about your Kerala event.", "/");
export default function Home() {
  return <div className="reference-home">
    <HeroSection />
    <ServicesGrid />
    <AboutPreview />
    <EventsPreview />
    <WhyChooseUs />
    <IndustriesSection />
    <ProcessSection />
    <HomeContact />
  </div>;
}
