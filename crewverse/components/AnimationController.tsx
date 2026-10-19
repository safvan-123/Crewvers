"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { startAnimations } from "../lib/animation-runtime.mjs";

const normalizePath = (path: string) =>
  path.replace(/\/$/, "") || "/";

export function scrollPageToTop() {
  const root = document.documentElement;
  const body = document.body;

  const rootBehavior = root.style.scrollBehavior;
  const bodyBehavior = body.style.scrollBehavior;

  root.style.scrollBehavior = "auto";
  body.style.scrollBehavior = "auto";

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto",
  });

  root.style.scrollBehavior = rootBehavior;
  body.style.scrollBehavior = bodyBehavior;
}

export default function AnimationController() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const historyNavigation = useRef(false);

  useEffect(() => {
    const onPopState = () => {
      if (
        normalizePath(window.location.pathname) !==
        normalizePath(previousPath.current)
      ) {
        historyNavigation.current = true;
      }
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  useLayoutEffect(() => {
    previousPath.current = pathname;

    // Preserve browser Back/Forward scroll restoration.
    if (historyNavigation.current) {
      historyNavigation.current = false;
      return;
    }

    // Preserve enquiry and service-category anchor links.
    if (window.location.hash) return;

    scrollPageToTop();

    let secondFrame = 0;

    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        if (!window.location.hash && window.scrollY !== 0) {
          scrollPageToTop();
        }
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [pathname]);

  useEffect(() => {
    const main = document.getElementById("main");

    if (main) {
      return startAnimations(main);
    }
  }, [pathname]);

  return null;
}