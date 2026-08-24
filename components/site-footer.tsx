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
    <footer className="border-t border-cyan-100/10 bg-[#030712]/95">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1.4fr_1fr] lg:px-10">
        <div>
          <p className="text-2xl font-black text-white">{brandName}</p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400">
            Free browser games for quick breaks. Open a game, learn the rules
            fast, and come back whenever you want one more round.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-slate-300 lg:items-end">
          {footerLinks.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-white">
              {item.label}
            </Link>
          ))}
          <a href={`mailto:${supportEmail}`} className="font-semibold text-cyan-200 hover:text-cyan-100">
            {supportEmail}
          </a>
        </div>
      </div>
    </footer>
  );
}
