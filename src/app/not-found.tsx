import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto max-w-xl space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
          404
        </p>
        <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">
          Page not found
        </h1>
        <p className="text-sm text-neutral-600 dark:text-slate-300">
          That link does not exist in JoshHub. Try a main area below.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {[
          { href: "/dashboard", label: "Dashboard" },
          { href: "/apps", label: "Apps" },
          { href: "/life", label: "Life" },
          { href: "/capture", label: "Capture" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
