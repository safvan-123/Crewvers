import HeroSection from "../components/HeroSection";
import AboutPreview from "../components/AboutPreview";
import ServicesGrid from "../components/ServicesGrid";
import WhyChooseUs from "../components/WhyChooseUs";
import IndustriesSection from "../components/IndustriesSection";
import ProcessSection from "../components/ProcessSection";
import CTASection from "../components/CTASection";
import { ArrowUpRight } from "lucide-react";
export default function Home() {
  return (
    <>
      <HeroSection />
      <div className="statement-strip">
        <div className="container">
          <span>RIGHT CREW</span>
          <ArrowUpRight />
          <span>RIGHT EVENTS</span>
          <ArrowUpRight />
          <span>RIGHT TIME</span>
          <ArrowUpRight />
        </div>
      </div>
      <AboutPreview />
      <ServicesGrid />
      <WhyChooseUs />
      <IndustriesSection />
      <ProcessSection />
      <CTASection />
    </>
  );
}
