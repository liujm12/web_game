import Link from "next/link";

type SiteHeaderProps = {
  brandName: string;
  compactGameHeader?: boolean;
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

export function SiteHeader({ brandName, compactGameHeader = false }: SiteHeaderProps) {
  return (
    <header
      className={`z-30 border-b border-white/10 bg-slate-950 md:bg-slate-950/90 md:backdrop-blur-xl ${
        compactGameHeader ? "relative md:sticky md:top-0" : "sticky top-0"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10 ${
          compactGameHeader ? "py-2 sm:py-3" : "py-3"
        }`}
      >
        <Link href="/" className="flex items-center gap-3">
          <span
            className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-sky-500 to-orange-400 font-black text-slate-950 ${
              compactGameHeader
                ? "h-9 w-9 text-base sm:h-11 sm:w-11 sm:text-lg"
                : "h-10 w-10 text-base sm:h-11 sm:w-11 sm:text-lg"
            }`}
          >
            TA
          </span>
          <div>
            <p
              className={`font-semibold tracking-tight text-white ${
                compactGameHeader ? "text-base sm:text-lg" : "text-lg"
              }`}
            >
              {brandName}
            </p>
            <p className="hidden text-xs uppercase tracking-[0.22em] text-cyan-200/70 sm:block">
              Browser games for quick breaks
            </p>
          </div>
        </Link>
        {compactGameHeader && (
          <Link
            href="/games"
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-slate-200 md:hidden"
          >
            All Games
          </Link>
        )}
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
      {!compactGameHeader && (
        <nav
          aria-label="Mobile quick links"
          className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3 sm:px-6 md:hidden"
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
      )}
    </header>
  );
}
