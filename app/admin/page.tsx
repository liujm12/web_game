import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminDashboard } from "@/components/admin-dashboard";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Admin | TurboArcade",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const content = await getSiteContent();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SiteHeader brandName={content.site.brandName} />
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <AdminDashboard initialContent={content} />
      </main>
      <SiteFooter
        brandName={content.site.brandName}
        supportEmail={content.site.supportEmail}
      />
    </div>
  );
}
