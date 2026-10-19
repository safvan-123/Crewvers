"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import CrewLink from "./CrewLink";

const links = [
  ["/", "Home"],
  ["/about", "About Us"],
  ["/services", "Services"],
  ["/events", "Events"],
  ["/contact", "Contact"],
];

export default function Header() {
  const path = usePathname().replace(/\/$/, "") || "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [contactActive, setContactActive] = useState(false);

  const reduced = useReducedMotion();
  const trigger = useRef<HTMLButtonElement>(null);

  const active =
    path === "/" && contactActive
      ? "/contact"
      : path.startsWith("/events/")
        ? "/events"
        : path;

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20);

    update();
    window.addEventListener("scroll", update, { passive: true });

    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (path !== "/") return;

    const contact = document.getElementById("contact");
    if (!contact || !window.IntersectionObserver) return;

    const observer = new IntersectionObserver(
      ([entry]) => setContactActive(entry.isIntersecting),
      { rootMargin: "-82px 0px -25% 0px" },
    );

    observer.observe(contact);

    return () => observer.disconnect();
  }, [path]);

  useEffect(() => {
    setOpen(false);
    setHovered(null);
  }, [path]);

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        trigger.current?.focus();
      }
    };

    window.addEventListener("keydown", key);

    return () => window.removeEventListener("keydown", key);
  }, [open]);

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <div className="container header-row">
        <Link
          href="/"
          className="logo-link"
          aria-label="Crewverse home"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/images/logo.webp"
            alt="CREWVERSE — Right Crew, Right Events, Right Time"
            width={1754}
            height={419}
            priority
            sizes="(max-width: 640px) 155px, 205px"
          />
        </Link>

        <nav
          className={`main-nav ${open ? "is-open" : ""}`}
          aria-label="Main navigation"
          id="main-nav"
          onMouseLeave={() => setHovered(null)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setHovered(null);
            }
          }}
        >
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={
                href === "/contact" && path === "/"
                  ? "#contact"
                  : href === "/"
                    ? "/"
                    : `${href}/`
              }
              aria-current={
                active === href
                  ? path === "/" && href === "/contact"
                    ? "location"
                    : "page"
                  : undefined
              }
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") {
                  setHovered(href);
                }
              }}
              onFocus={() => setHovered(href)}
              onClick={() => {
                setOpen(false);
                setHovered(null);
              }}
            >
              <span className="nav-label">
                {label}

                {(hovered || active) === href && (
                  <motion.span
                    className="nav-indicator"
                    layoutId="navbar-indicator"
                    initial={false}
                    transition={
                      reduced
                        ? { duration: 0 }
                        : {
                            type: "tween",
                            duration: 0.28,
                            ease: [0.22, 1, 0.36, 1],
                          }
                    }
                  />
                )}
              </span>
            </Link>
          ))}

          <CrewLink
            className="button yellow mobile-menu-cta"
            onClick={() => setOpen(false)}
          >
            Get a Crew <ArrowUpRight size={17} />
          </CrewLink>
        </nav>

        <CrewLink className="button yellow header-cta">
          Get a Crew <ArrowUpRight size={17} />
        </CrewLink>

        <button
          ref={trigger}
          className="menu-trigger"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="main-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}