import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  href: string;
  isActive: boolean;
};

export default function NavButton({ label, href, isActive }: Props) {
  return <Button asChild size="sm" variant="link" className={cn(
    "w-full lg:w-auto justify-center font-medium hover:no-underline text-zinc-900 focus:bg-primary/40 transition hover:bg-primary/30 border-none focus-visible:ring-transparent outline-none focus-visible:ring-offset-0",
    isActive ? "bg-primary/20" : "bg-transparent"
  )}>
    <Link href={href} >{label}</Link>
  </Button>;
}
