import { cache } from "react";
import { company as defaults, services as defaultServices } from "./content";
import { fetchPublished, filterPublishedEvents } from "./cms-core.mjs";

export type CmsImage = { url: string; alt: string; width?: number; height?: number; hotspot?: { x: number; y: number } };
export type CrewEvent = {
  _id: string; _updatedAt?: string; title: string; slug: string;
  summary?: string; details?: string; startDate: string; endDate?: string;
  venue?: string; city?: string; cover?: CmsImage;
};
const imageProjection = `{"url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, alt, hotspot}`;
const read = (query: string) => fetchPublished(query, {
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || "production",
});
type WebsiteContent = {
  company: typeof defaults; services: typeof defaultServices;
  heroTitle: string; heroHighlight: string; heroIntroduction: string;
  aboutIntroduction: string; heroImage: CmsImage | null; aboutImage: CmsImage | null;
};
export const getWebsite = cache(async (): Promise<WebsiteContent> => {
  const doc = await read(`*[_type == "websiteContent" && _id == "websiteContent"][0]{heroTitle, heroHighlight, heroIntroduction, aboutIntroduction, contact, services, "heroImage": heroImage${imageProjection}, "aboutImage": aboutImage${imageProjection}}`);
  const contact = doc?.contact || {};
  const phone = typeof contact.phone === "string" && /^\+?[\d\s()-]{7,22}$/.test(contact.phone)
    ? contact.phone : defaults.phone;
  const digits = phone.replace(/\D/g, "");
  const company = { ...defaults, phone, phoneHref: `tel:${phone.replace(/[\s()-]/g, "")}`,
    email: typeof contact.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) ? contact.email : defaults.email,
    whatsappNumber: digits,
    whatsappConfirmed: typeof contact.whatsappConfirmed === "boolean" ? contact.whatsappConfirmed : defaults.whatsappConfirmed,
  };
  const services = defaultServices.map((service) => {
    const edited = Array.isArray(doc?.services) ? doc.services.find((item: any) => item.id === service.id) : null;
    return { ...service,
      short: edited?.short?.trim() || service.short,
      description: edited?.description?.trim() || service.description,
      roles: Array.isArray(edited?.roles) && edited.roles.length ? edited.roles.filter((role: unknown) => typeof role === "string") as string[] : service.roles,
    };
  });
  return {
    company, services,
    heroTitle: doc?.heroTitle?.trim() || "The Right Crew",
    heroHighlight: doc?.heroHighlight?.trim() || "for Every Event.",
    heroIntroduction: doc?.heroIntroduction?.trim() || "Event staff, entertainers and film crews for your next big moment in Kerala.",
    aboutIntroduction: doc?.aboutIntroduction?.trim() || "CrewVerse connects event organisers, businesses and production teams with the right people. From guest support to live performers and film crews, we help you plan the team your occasion needs.",
    heroImage: doc?.heroImage?.url ? doc.heroImage as CmsImage : null,
    aboutImage: doc?.aboutImage?.url ? doc.aboutImage as CmsImage : null,
  };
});
export const getEvents = cache(async (): Promise<CrewEvent[]> => {
  const events = await read(`*[_type == "event" && !(_id in path("drafts.**")) && !(_id in path("versions.**")) && defined(slug.current)] | order(startDate desc){_id, _updatedAt, title, "slug": slug.current, summary, details, startDate, endDate, venue, city, "cover": cover${imageProjection}}`);
  return filterPublishedEvents(events || []);
});
export function eventDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(value));
}
