import type { Metadata } from "next";

export const SITE_URL = "https://playturboarcade.com";
export const SITE_NAME = "TurboArcade";
export const SOCIAL_IMAGE_SIZE = {
  width: 1200,
  height: 630,
} as const;

type SocialMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
};

export function buildSocialMetadata({
  title,
  description,
  path,
  image = "/opengraph-image",
  imageAlt = "TurboArcade free browser games social card",
  type = "website",
}: SocialMetadataOptions): Metadata {
  const images = [
    {
      url: image,
      ...SOCIAL_IMAGE_SIZE,
      alt: imageAlt,
    },
  ];

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type,
      locale: "en_US",
      siteName: SITE_NAME,
      url: path,
      title,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map(({ url, alt }) => ({ url, alt })),
    },
  };
}
