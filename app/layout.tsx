import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://playturboarcade.com"),
  title: "TurboArcade | Free Browser Games",
  description:
    "TurboArcade is a polished starter site for fast browser games, ad-ready layouts, and SEO-friendly launch pages.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();

  return (
    <html lang="en" className="h-full antialiased">
      {adsenseClient ? (
        <head>
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        </head>
      ) : null}
      <body className="min-h-full flex flex-col bg-slate-950 text-white">
        {children}
      </body>
    </html>
  );
}
