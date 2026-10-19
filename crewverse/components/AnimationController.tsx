"use client";
import {useEffect} from "react";
import {usePathname} from "next/navigation";
import {startAnimations} from "../lib/animation-runtime.mjs";

export default function AnimationController() {
  const path = usePathname();
  useEffect(() => {
    const main = document.getElementById("main");
    if (main) return startAnimations(main);
  }, [path]);
  return null;
}
