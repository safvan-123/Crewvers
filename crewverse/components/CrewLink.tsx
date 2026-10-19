"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import type {ComponentProps} from "react";

export default function CrewLink(props: Omit<ComponentProps<typeof Link>, "href">) {
  const home = usePathname() === "/";
  return <Link {...props} href={home ? "#enquiry-form" : "/contact/#enquiry-form"} data-magnetic />;
}
