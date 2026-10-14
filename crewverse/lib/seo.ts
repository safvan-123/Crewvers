import type { Metadata } from "next";
const configured = process.env.NEXT_PUBLIC_SITE_URL;
const parsed = configured ? new URL(configured) : null;
if (parsed && (parsed.protocol !== "https:" || parsed.pathname !== "/" || parsed.search || parsed.hash)) {
  throw new Error("NEXT_PUBLIC_SITE_URL must be your actual HTTPS production origin, without a path, query or fragment.");
}
export const siteUrl = parsed?.origin;
export const policiesApproved = process.env.POLICIES_APPROVED === "true";
export function pageMetadata(title: string, description: string, path: string, image = "/images/concert.webp"): Metadata {
  return {
    title, description,
    ...(siteUrl ? { alternates: { canonical: `${siteUrl}${path}` } } : {}),
    openGraph: { title: `${title} | CrewVerse`, description, type: "website", ...(siteUrl ? {url: `${siteUrl}${path}`, images: [{url: image}]} : {}) },
    twitter: { card: "summary_large_image", title: `${title} | CrewVerse`, description, ...(siteUrl ? {images: [image]} : {}) },
  };
}
