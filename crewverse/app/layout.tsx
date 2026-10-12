import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { company } from "../lib/content";
const website = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = {
  ...(website ? { metadataBase: new URL(website) } : {}),
  title: {
    default: "CREWVERSE | Event, Entertainment & Film Workforce",
    template: "%s | CREWVERSE",
  },
  description:
    "The right crew for your event, performance and production. Explore CREWVERSE staffing, entertainment, film manpower and specialized workforce solutions.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "CREWVERSE — Powering Every Event",
    description:
      "Event staffing, entertainment and film production workforce solutions.",
    type: "website",
    ...(website
      ? { images: [{ url: "/images/concert.webp", width: 2000, height: 1335 }] }
      : {}),
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    telephone: company.phone,
    email: company.email,
    ...(website ? { url: website, logo: `${website}/images/logo.webp` } : {}),
  };
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
