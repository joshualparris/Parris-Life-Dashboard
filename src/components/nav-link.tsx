"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavLinkProps = {
  href: string;
  children: ReactNode;
};

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname?.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={[
        "rounded-full border px-3 py-1.5 font-medium shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:border-slate-800 dark:text-slate-100",
        isActive
          ? "border-emerald-200 bg-emerald-50 text-emerald-800 shadow-md dark:border-emerald-700/70 dark:bg-emerald-900/40 dark:text-emerald-100"
          : "border-neutral-200 bg-white/95 text-neutral-800 hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
