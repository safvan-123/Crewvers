import {pageMetadata} from "../../lib/seo";
import { Phone, Mail, ArrowUpRight } from "lucide-react";
import {getWebsite} from "../../lib/cms";
import ContactForm from "../../components/ContactForm";
import PageIntro from "../../components/PageIntro";
export const metadata = pageMetadata('Get a Crew in Kerala', 'Discuss your Kerala event or production crew requirements with CrewVerse. Request availability and a quote.', '/contact/');
export default async function Contact() {
  const {company, services} = await getWebsite();
  return (
    <>
      <PageIntro
        eyebrow="LET’S BRING YOUR TEAM TOGETHER"
        title={
          <>
            YOUR NEXT BIG MOMENT.
            <br />
            <span>STARTS HERE.</span>
          </>
        }
        description="Tell us what you’re planning. We’ll discuss the roles, people and support your event or production needs."
      />
      <section className="container contact-layout">
        <div className="contact-sidebar">
          <p className="eyebrow">
            <span />
            TALK TO CREWVERSE
          </p>
          <h2>
            BIG PLANS.
            <br />
            GOOD PEOPLE.
            <br />
            <span>LET’S CONNECT.</span>
          </h2>
          <p>
            Whether you’re planning an event, sourcing performers or putting a
            production team together, share your requirements with us.
          </p>
          <a href={company.phoneHref} className="contact-channel">
            <Phone size={22} />
            <div>
              <span>GIVE US A CALL</span>
              <strong>{company.phone}</strong>
            </div>
            <ArrowUpRight size={19} />
          </a>
          <a href={`mailto:${company.email}`} className="contact-channel">
            <Mail size={22} />
            <div>
              <span>DROP US A LINE</span>
              <strong>{company.email}</strong>
            </div>
            <ArrowUpRight size={19} />
          </a>
          <div className="contact-note">
            <span>WHAT TO SHARE</span>
            <p>
              Service type, city, dates, crew size and specific roles. A clear
              brief helps us have a useful first conversation.
            </p>
          </div>
        </div>
        <ContactForm company={company} services={services}/>
      </section>
    </>
  );
}
