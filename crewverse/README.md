# Current updated project

See **../SETUP.md** for the current Sanity, policy and deployment instructions.
The original project notes below are retained for background; the current setup
and verification documents take precedence.

# CREWVERSE — Next.js Frontend

A four-page, responsive, cinematic website for CREWVERSE event staffing, entertainment and film workforce solutions. Company content comes from the supplied profile and development brief. No backend, database, authentication, API endpoint, CMS or admin dashboard is included.

## Run locally

Requires Node.js 20.9+ (Node.js 22 recommended) and npm.

```bash
npm ci
npm run dev
```

Open http://localhost:3000.

```bash
npm test
npm run typecheck
npm run build
```

`npm run build` produces a static website in `out/`. The ZIP includes both the editable Next.js source and the ready-built static output. Edit the source, not `out/`.

## Pages

- `app/page.tsx`: homepage.
- `app/services/page.tsx`: four service categories and complete role lists.
- `app/about/page.tsx`: company purpose, problem, solution, vision and mission.
- `app/contact/page.tsx`: contacts and frontend-only enquiry.
- `components/`: reusable Header, HeroSection, AboutPreview, ServicesGrid, WhyChooseUs, IndustriesSection, ProcessSection, CTASection, Footer, ContactForm and supporting components.
- `lib/content.ts`: company contacts and editable business content.
- `lib/enquiry.mjs`: message formatting, validation and external enquiry links.
- `app/globals.css`: responsive visual design and interaction styles.
- `public/images/`: locally hosted photography, cropped faithful logo and unchanged original logo.

## Enquiry flow

The PDF confirms **+91 9746071345** and **crewversegang@gmail.com**. It does not explicitly confirm WhatsApp availability, so `company.whatsappConfirmed` defaults to `false`.

The form validates the required name, phone, service, location and requirements, optional email, and optional date. It prepares a message for review, then offers a working email-app link. If an email app is not configured, visitors can copy the prepared message into their usual email service. No enquiry is stored or sent by this website; visitors send the message in their email app.

To enable WhatsApp once the client confirms it, change `whatsappConfirmed` to `true` in `lib/content.ts` and verify `whatsappNumber`. The form then offers a choice of email or WhatsApp. The WhatsApp route opens a prefilled message; visitors must press Send there.

Service-page enquiry links preselect the corresponding service on the contact page. Call and direct-email links work on all supported devices with the corresponding apps configured.

## Design and dependencies

Next.js App Router, React, TypeScript, Tailwind CSS v4, Lucide icons and Motion animations. Inter and Space Grotesk variable fonts are bundled locally through Fontsource; no Google Fonts network request is needed at build time or during browsing.

Photography is downloaded locally, converted to quality WebP, and rendered with Next.js Image. Static export uses `images.unoptimized: true` because a static host has no Next.js image optimization server. Image files are already optimized; the Next/Image layout reserves space and uses lazy loading below the fold. See `ASSET-SOURCES.json` for image URLs and licensing source. Stock imagery is illustrative, not evidence of Crewverse employees or completed projects. The supplied logo is tightly cropped without changing its design, colors, proportions or tagline; the original is preserved.

The 50,000+ professionals figure on the About page is explicitly identified as a **future goal** from the profile. No client logos, reviews, awards, completed-project counts, address or social URLs have been invented.

## Deploy

- Vercel: import this folder as a Next.js project; use the standard `npm run build` command.
- Cloudflare Pages: framework preset **None**, build command `npm run build`, output directory `out`, Node.js 22.
- Netlify: use `npm run build` and publish `out` (configuration included).
- Other static hosting: upload the **contents** of `out/` together, including `_next/` and `images/`.

A domain was not supplied. When your domain is confirmed, set `NEXT_PUBLIC_SITE_URL` to its full HTTPS URL and rebuild to enable domain-aware Organization data and Open Graph image URLs. The code does not register or connect a domain.

## Accessibility and verification

Semantic sections and headings, accessible mobile navigation, active-page indications, skip link, visible keyboard focus, labelled form fields, associated error text, first-error focus, native keyboard-operable service accordions, reduced-motion handling and mobile-specific CSS are included. Breakpoints cover narrow mobile, wider mobile, tablet and desktop layouts.

See `VERIFICATION.md` for checks actually performed. Browser visual and interactive testing must be completed on real target devices before public launch.
