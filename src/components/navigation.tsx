"use client";

import React from "react";
import NavButton from "./navButton";
import { usePathname } from "next/navigation";

const routes = [
  {
    href: "/save",
    label: "Summary",
  },
  {
    href: "/save/incomes",
    label: "Incomes",
  },
  {
    href: "/save/expenses",
    label: "Expenses",
  },
  {
    href: "/save/transfers",
    label: "Transfers",
  },
  {
    href: "/save/vaults",
    label: "Vaults",
  },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-x-2 overflow-x-auto">
      {routes.map((route) => (
        <NavButton
          key={route.href}
          href={route.href}
          label={route.label}
          isActive={pathname === route.href}
        />
      ))}
    </nav>
  );
}
