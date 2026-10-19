"use client";
import {useEffect} from "react";
import {usePathname} from "next/navigation";

const easing = "cubic-bezier(.22,1,.36,1)";

/** Progressive enhancement: no initial hidden styles, wrappers or scroll locks. */
export default function AnimationController() {
  const path = usePathname();
  useEffect(() => {
    const main = document.getElementById("main");
    if (!main || !window.IntersectionObserver || !Element.prototype.animate) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const disposers: Array<() => void> = [];
    function play(element: Element, frames: Keyframe[], duration = 600, delay = 0) {
      if (preference.matches) return;
      const animation = element.animate(frames, {duration, delay, easing, fill: "backwards"});
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
    }
    const fade = (element: Element, delay = 0) => play(element,
      [{opacity: .45, transform: "translateY(20px)"}, {opacity: 1, transform: "translateY(0)"}], 600, delay);

    // Only the incoming page animates; Next retains history, focus and scroll ownership.
    play(main, [{opacity: .85}, {opacity: 1}], 260);
    const hero = main.querySelector(".hero");
    if (hero) {
      const parts = [".hero-eyebrow", "h1", ".reference-tagline", ".hero-details > p", ".hero-actions"];
      parts.forEach((selector, index) => {
        const part = hero.querySelector(selector);
        if (part) fade(part, index * 90);
      });
      const heading = hero.querySelector("h1");
      if (heading) play(heading, [{clipPath: "inset(0 0 100% 0)"}, {clipPath: "inset(0 0 0% 0)"}], 750);
      const photo = hero.querySelector(".hero-photo");
      if (photo) play(photo, [{transform: "scale(1.04)"}, {transform: "scale(1)"}], 1200);
    }
    const seen = new WeakSet<Element>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting || seen.has(entry.target)) continue;
        const element = entry.target as HTMLElement;
        seen.add(element);
        observer.unobserve(element);
        const delay = Math.min(180, Number(element.dataset.revealDelay || 0) * 1000);
        fade(element, delay);
        if (element.matches(".section-heading")) {
          element.querySelectorAll("h2, .section-description, .compact-intro").forEach((child, i) => fade(child, i * 80));
        }
        // Reveal only existing photography, preserving dimensions and captions.
        if (element.matches(".about-photo, .about-banner, .service-detail-photo, .event-cover, .event-detail-cover, .industry-photo")) {
          const image = element.querySelector("img");
          if (image) play(image, [
            {clipPath: "inset(0 0 8% 0)", transform: "scale(1.035)"},
            {clipPath: "inset(0 0 0% 0)", transform: "scale(1)"},
          ], 700);
        }
      }
    }, {threshold: .08});
    const selectors = "[data-reveal], .section-heading, .about-banner, .industry-photo, .industry-list > div, .event-card, .event-cover, .empty-events, .event-detail-cover, .contact-sidebar, .contact-form, .home-contact-grid > div, .cta-layout";
    main.querySelectorAll(selectors).forEach(element => {
      if (element.closest(".hero")) return;
      // Avoid applying two simultaneous parent/child fades.
      if (!element.matches("[data-reveal]") && element.parentElement?.closest("[data-reveal]")) return;
      observer.observe(element);
    });
    // Existing step rules become a viewport-driven timeline, without scroll listeners.
    const steps = Array.from(main.querySelectorAll<HTMLElement>(".process-step"));
    const timeline = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const step = entry.target as HTMLElement;
        step.style.setProperty("--step-progress", String(entry.intersectionRatio));
        if (entry.isIntersecting) {
          steps.forEach(item => item.toggleAttribute("data-step-active", item === step));
        }
      }
    }, {rootMargin: "-15% 0px -30% 0px", threshold: Array.from({length: 21}, (_, i) => i / 20)});
    steps.forEach(step => timeline.observe(step));

    const precise = window.matchMedia("(hover: hover) and (pointer: fine)");
    document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach(button => {
      const reset = () => {button.style.removeProperty("--magnetic-x"); button.style.removeProperty("--magnetic-y");};
      const move = (event: PointerEvent) => {
        if (!precise.matches || preference.matches || event.pointerType === "touch") return;
        const rect = button.getBoundingClientRect();
        button.style.setProperty("--magnetic-x", `${Math.max(-3, Math.min(3, (event.clientX - rect.left - rect.width / 2) * .05))}px`);
        button.style.setProperty("--magnetic-y", `${Math.max(-3, Math.min(3, (event.clientY - rect.top - rect.height / 2) * .08))}px`);
      };
      button.addEventListener("pointermove", move);
      button.addEventListener("pointerleave", reset);
      button.addEventListener("blur", reset);
      disposers.push(() => {button.removeEventListener("pointermove", move); button.removeEventListener("pointerleave", reset); button.removeEventListener("blur", reset); reset();});
    });
    const stop = () => {if (preference.matches) animations.forEach(animation => animation.cancel());};
    preference.addEventListener("change", stop);
    return () => {
      observer.disconnect(); timeline.disconnect();
      animations.forEach(animation => animation.cancel());
      disposers.forEach(dispose => dispose());
      preference.removeEventListener("change", stop);
    };
  }, [path]);
  return null;
}
