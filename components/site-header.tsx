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
];

const mobileNavItems = navItems.filter((item) =>
  ["Arcade", "Brain", "All Games"].includes(item.label),
);

export function SiteHeader({ brandName, compactGameHeader = false }: SiteHeaderProps) {
  return (
    <header
      className={`z-30 border-b border-cyan-200/10 bg-[#030712]/95 shadow-[0_12px_40px_rgba(2,6,23,0.45)] md:bg-[#030712]/82 md:backdrop-blur-xl ${
        compactGameHeader ? "relative md:sticky md:top-0" : "sticky top-0"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10 ${
          compactGameHeader ? "py-2 sm:py-3" : "py-3"
        }`}
      >
        <Link href="/" className="group flex items-center gap-3">
          <span
            className={`relative inline-flex -skew-x-6 items-center justify-center rounded-[18px] border border-cyan-100/35 bg-[linear-gradient(135deg,#22d3ee_0%,#38bdf8_46%,#fb923c_100%)] font-black text-cyan-950 shadow-[0_0_28px_rgba(34,211,238,0.28)] transition group-hover:translate-x-0.5 ${
              compactGameHeader
                ? "h-9 w-9 text-base sm:h-11 sm:w-11 sm:text-lg"
                : "h-10 w-10 text-base sm:h-11 sm:w-11 sm:text-lg"
            }`}
          >
            <span className="skew-x-6">TA</span>
          </span>
          <div>
            <p
              className={`font-semibold tracking-tight text-white ${
                compactGameHeader ? "text-base sm:text-lg" : "text-lg"
              }`}
            >
              {brandName}
            </p>
            <p className="hidden text-xs uppercase tracking-[0.22em] text-cyan-100/70 sm:block">
              Browser games for quick breaks
            </p>
          </div>
        </Link>
        {compactGameHeader && (
          <Link
            href="/games"
            className="rounded-full border border-cyan-100/15 bg-cyan-300/10 px-3 py-1.5 text-sm font-semibold text-cyan-100 md:hidden"
          >
            All Games
          </Link>
        )}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-sm font-semibold text-cyan-50/80 transition hover:bg-cyan-300/10 hover:text-cyan-100"
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
              className="shrink-0 rounded-full border border-cyan-100/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
