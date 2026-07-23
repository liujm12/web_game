import Link from "next/link";

type SiteFooterProps = {
  brandName: string;
  supportEmail: string;
};

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
  { href: "/dmca", label: "DMCA" },
];

export function SiteFooter({ brandName, supportEmail }: SiteFooterProps) {
  return (
    <footer className="border-t border-white/10 bg-slate-950/95">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1.4fr_1fr] lg:px-10">
        <div>
          <p className="text-2xl font-semibold text-white">{brandName}</p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400">
            Built for quick sessions, strong retention, and clean ad-ready page
            layouts. This starter build keeps the catalog small so the site can
            grow with better content quality and better monetization hygiene.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-slate-300 lg:items-end">
          {footerLinks.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-white">
              {item.label}
            </Link>
          ))}
          <a href={`mailto:${supportEmail}`} className="text-cyan-200 hover:text-cyan-100">
            {supportEmail}
          </a>
        </div>
      </div>
    </footer>
  );
}
