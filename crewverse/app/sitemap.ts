import type {MetadataRoute} from "next";
import {getEvents} from "../lib/cms";
import {siteUrl, policiesApproved} from "../lib/seo";
export const dynamic = "force-static";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 if (!siteUrl) return [];
 const paths = ["/","/about/","/services/","/contact/","/events/"];
 if (policiesApproved) paths.push("/terms/","/payment-policy/","/cancellation-refund-policy/","/safety-liability-policy/");
 return [...paths.map(path=>({url:`${siteUrl}${path}`})), ...(await getEvents()).map(event=>({url:`${siteUrl}/events/${event.slug}/`,...(event._updatedAt ? {lastModified:event._updatedAt} : {})}))];
}
