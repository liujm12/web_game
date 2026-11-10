import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";

import RootLayout from "@/app/layout";

describe("RootLayout AdSense verification snippet", () => {
  const originalClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  afterEach(() => {
    if (originalClient === undefined) {
      delete process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
    } else {
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT = originalClient;
    }
  });

  it("renders a real AdSense script tag when the publisher client is configured", () => {
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT = "ca-pub-1015999676044681";

    const html = renderToStaticMarkup(
      <RootLayout>
        <main>TurboArcade</main>
      </RootLayout>,
    );

    expect(html).toContain(
      '<script async="" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1015999676044681" crossorigin="anonymous">',
    );
  });

  it("declares the global smooth-scroll behavior for Next.js navigation", () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <main>TurboArcade</main>
      </RootLayout>,
    );

    expect(html).toContain('data-scroll-behavior="smooth"');
  });
});
