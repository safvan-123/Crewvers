import {Phone, Mail, ArrowUpRight} from "lucide-react";
import {getWebsite} from "../lib/cms";
import ContactForm from "./ContactForm";
export default async function HomeContact() {
 const {company,services} = await getWebsite();
 return <section id="contact" className="section home-contact"><div className="container home-contact-grid"><div><p className="eyebrow">CONTACT US</p><h2>Let’s Plan Your Event</h2><p>Tell us what you need. We’ll help you plan the right crew.</p><div className="home-contact-channels"><a href={company.phoneHref}><Phone size={22}/><span>{company.phone}<small>Call Us</small></span></a><a href={`mailto:${company.email}`}><Mail size={22}/><span>{company.email}<small>Email Us</small></span></a>{company.whatsappConfirmed && <a href={`https://wa.me/${company.whatsappNumber}`} target="_blank" rel="noopener noreferrer">WhatsApp Enquiry <ArrowUpRight size={17}/></a>}</div></div><ContactForm company={company} services={services}/></div></section>;
}
