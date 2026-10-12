"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
const links = [
  ["/", "Home"],
  ["/about", "About Us"],
  ["/services", "Services"],
  ["/contact", "Contact"],
];
export default function Header() {
  const path = usePathname().replace(/\/$/, "") || "/";
  const [open, setOpen] = useState(false),
    [scrolled, setScrolled] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
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
        >
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={path === href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="button yellow mobile-menu-cta"
            onClick={() => setOpen(false)}
          >
            Get a Crew <ArrowUpRight size={17} />
          </Link>
        </nav>
        <Link href="/contact" className="button yellow header-cta">
          Get a Crew <ArrowUpRight size={17} />
        </Link>
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
