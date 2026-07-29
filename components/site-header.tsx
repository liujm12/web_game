import Link from "next/link";

type SiteHeaderProps = {
  brandName: string;
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/categories/arcade", label: "Arcade" },
  { href: "/categories/brain", label: "Brain" },
  { href: "/games", label: "All Games" },
  { href: "/admin", label: "Admin" },
];

const mobileNavItems = navItems.filter((item) =>
  ["Arcade", "Brain", "All Games"].includes(item.label),
);

export function SiteHeader({ brandName }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-sky-500 to-orange-400 text-lg font-black text-slate-950">
            TA
          </span>
          <div>
            <p className="text-lg font-semibold tracking-tight text-white">
              {brandName}
            </p>
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">
              Browser games for quick breaks
            </p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <nav
        aria-label="Mobile quick links"
        className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 pb-4 md:hidden"
      >
        {mobileNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
