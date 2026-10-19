# CrewVerse animation and routing upgrade

## Run and deploy

Open the `crewverse` folder in the extracted project. Use Node.js 22+ and run:

```sh
npm ci
npm run dev
```

Production checks and static export:

```sh
npm test
npm run typecheck
npm run build
python3 scripts/verify-upgrade.py
```

The existing deployment remains Next.js static export with trailing slashes.
The `out/` folder contains the updated deployable static site. All source,
configuration, original public assets and the unchanged lockfile are included.
The archive excludes Git history, node_modules, .next caches and temporary files.
The existing `.env.example` is retained unchanged; use your real deployment
configuration for Sanity and the production origin. No secrets were added.

## Implementation

- Retained Next.js App Router, React, Motion, all existing routes and static hosting configuration. No dependencies were added or updated.
- Homepage Contact links to `#contact`. Get a Crew links to `#enquiry-form` on the homepage, and `/contact/#enquiry-form` on other routes. Header, mobile menu, footer Get a Crew and floating mobile booking links share this behavior.
- About, Services and Events remain dedicated pages. Existing homepage preview links and service category anchors are preserved. The enquiry form has an anchor on both pages.
- Cinematic hero entrance with staggered eyebrow, heading mask reveal, tagline, description and CTA group; background zooms from 1.04 to 1.
- Reusable once-per-page-visit viewport fade-up reveals; section heading/description and card staggers; selective existing image masks and zoom-outs.
- Service card elevation, restrained scale, brand border and image zoom; arrow, keyboard focus and touch feedback.
- Motion shared-layout navbar underline for active, hover and keyboard focus states. Home Contact active state follows the contact section. Event detail routes highlight Events. Mobile menu transitions in both directions.
- Incoming page fade without overlays, routing interception, artificial loading or scroll manipulation. Native Next links retain prefetching, history and anchor handling.
- Progressive How It Works step reveals and viewport-driven existing rule fills, with subtle active-number emphasis. No process content or layout changes.
- Restrained magnetic Get a Crew movement on precise pointers only. Focus and touch feedback remain available. Reduced-motion preferences disable pointer motion and motion animations.
- Existing event-card/cover selectors support real future published events without creating any event content. The exact Events empty state is preserved.
- Form focus transitions and native accordion opening micro-interaction; all validation, message generation, email/WhatsApp behavior and CMS logic remain unchanged.

Animations enhance already visible server HTML using the Web Animations API
and IntersectionObserver. There are no permanent opacity-zero states, no new
scroll listeners for reveals, no content replacement and no additional layout
wrappers for page transitions. Cleanup cancels animations and disconnects
observers when routes change. Reduced-motion changes also cancel running
animations. Existing responsive breakpoints and original CSS remain intact.

## Modified files

- `app/globals.css` — appended motion, interaction, anchor and menu styles.
- `app/layout.tsx` — installs the shared enhancement controller.
- `components/Header.tsx` — hybrid links, animated indicator and active states.
- `components/Footer.tsx` — reuses hybrid Get a Crew links.
- `components/HeroSection.tsx` — stable hero ID; per-element entrance hooks through existing classes.
- `components/HomeContact.tsx` — contact section anchor.
- `components/ContactForm.tsx` — form anchor only; no other form changes.
- `components/ProcessSection.tsx` — section ID and step stagger.
- `components/WhyChooseUs.tsx` — section ID and card stagger.
- `components/IndustriesSection.tsx` — section ID.
- `components/EventCards.tsx` — existing event card stagger attributes.
- `components/Reveal.tsx` — server-rendered, visible progressive-enhancement marker.
- `next-env.d.ts` — Next regenerated production route type references during build.

Added:

- `components/AnimationController.tsx` — reusable entrance, viewport, image, timeline and pointer interactions, with lifecycle cleanup and reduced-motion handling.
- `components/CrewLink.tsx` — shared real Next navigation link for Get a Crew.
- `scripts/verify-upgrade.py` — dependency-free static export/preservation audit.
- `UPGRADE-REPORT.md` — this report.

The `out/` files were regenerated from the updated source. Every original
source route remains present, including policy pages and dynamic published-event
support. `package.json`, `package-lock.json`, all `lib/` files, SEO definitions,
original stylesheet rules and all public assets are unchanged.

## Checks actually passed

- `npm ci --no-audit --no-fund` — installed the original locked dependencies.
- `npm test` — 10/10 existing CMS and enquiry tests passed.
- `npm run typecheck` — passed.
- `npm run build` — Next.js production compilation, TypeScript and static export passed.
- `python3 scripts/verify-upgrade.py ../../../input/Crewverse-Nextjs-Frontend.zip` — passed in the implementation workspace. For a repeat baseline comparison elsewhere, pass the path to your original ZIP.
- Static audit: 13 exported HTML documents; required five routes present; local link destinations, referenced assets, hash targets and unique IDs pass. Correct server-rendered hybrid destinations and Events navigation are present.
- Compared all five primary pages against the original exported HTML: visible text (including titles), image attributes and metadata match exactly.
- All 38 original public assets are byte-identical. All business/CMS/SEO library files are byte-identical. Form source differs only by its added anchor ID. Dependency declarations and lockfile are byte-identical. The original stylesheet is retained verbatim before the appended enhancement rules.

## Omissions and verification limits

- Marquee omitted: there is no existing strip to reuse; inserting a new band beneath the hero would move the original sections and change the layout.
- No genuine events or event gallery are present in the supplied fallback export. Nothing was invented. Existing event cover animations are ready for published event content; a gallery was not added.
- Browser visual/interaction testing was unavailable under this environment's supported preview workflow. Desktop/tablet/mobile appearance, real animation playback, navbar interpolation, mobile menu behavior, back/forward interactions, browser console/hydration behavior, no-JavaScript browsing and reduced-motion playback were not browser-verified. Static/source checks are not a substitute for those tests.
- Live Sanity content was not tested because no configured production environment was supplied. The build used the existing fallback content and preserved the CMS integration exactly.
- No email or WhatsApp message was sent. Existing enquiry validation and link-generation unit tests passed; end-to-end sending was not tested.
- No lint script/configuration or browser test suite exists in the supplied project. No lint pass, Lighthouse score, Core Web Vitals or real-device performance result is claimed.
- No deployment or public publication was requested or performed.
