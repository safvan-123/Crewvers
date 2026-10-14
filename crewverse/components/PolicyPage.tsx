import Link from "next/link";
import PageIntro from "./PageIntro";
import policyContent from "../lib/policy-content.json";
import {getWebsite} from "../lib/cms";
import {policiesApproved, pageMetadata, siteUrl} from "../lib/seo";
export const policyPages = {
 terms: {title:"Terms & Conditions", path:"/terms/", section:"terms"},
 payment: {title:"Payment Policy", path:"/payment-policy/", section:"payment"},
 cancellation: {title:"Cancellation & Refund Policy", path:"/cancellation-refund-policy/", section:"cancellation"},
 safety: {title:"Safety & Liability Policy", path:"/safety-liability-policy/", section:"safety"},
} as const;
export function policyMetadata(key: keyof typeof policyPages) {
 const page = policyPages[key];
 return {...pageMetadata(page.title, `CrewVerse ${page.title.toLowerCase()}. Review the terms relevant to your event or crew booking.`, page.path), robots:{index:policiesApproved && !!siteUrl,follow:true,googleBot:{index:policiesApproved && !!siteUrl,follow:true}}};
}
export default async function PolicyPage({kind}: {kind: keyof typeof policyPages}) {
 const page = policyPages[kind];const {company} = await getWebsite();
 const preview = process.env.NODE_ENV === "development" && process.env.POLICY_PREVIEW === "true";
 const showText = policiesApproved || preview;
 return <><PageIntro eyebrow="BOOKING INFORMATION" title={page.title} description="Booking information for CrewVerse clients."/><section className="container policy-page">
   {preview && !policiesApproved && <p className="policy-review-banner">Local draft preview — for client and legal review.</p>}
   {!showText ? <div className="policy-prose"><h2>Review your booking terms</h2><p>The applicable booking, payment, cancellation and safety arrangements will be shared in writing with your quotation. Please contact CrewVerse to review them before confirming a booking.</p><Link href="/contact" className="button yellow">Discuss Your Booking</Link></div> : <div className="policy-prose">
   {policyContent[page.section].map(section => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((text,i) => text.startsWith("- ") ? <ul key={i}>{text.split("\n").filter(Boolean).map((line,j)=><li key={j}>{line.replace(/^- /,"")}</li>)}</ul> : <p key={i}>{text}</p>)}</section>)}
   </div>}
   <nav className="policy-links" aria-label="Related policies">{Object.entries(policyPages).filter(([key])=>key!==kind).map(([key,p])=><Link href={p.path} key={key}>{p.title}</Link>)}</nav>
   <div className="policy-contact"><h2>Contact CrewVerse</h2><a href={company.phoneHref}>{company.phone}</a><a href={`mailto:${company.email}`}>{company.email}</a></div>
 </section></>;
}
