import { ImageResponse } from "next/og";

import { SocialCard } from "@/components/social-card";
import { getGameSocialCardData } from "@/lib/social-image";
import { getSiteContent } from "@/lib/site-content";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

type GameSocialImageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: GameSocialImageProps) {
  const { slug } = await params;
  const content = await getSiteContent();
  const card = getGameSocialCardData(content, slug);

  return new ImageResponse(<SocialCard card={card} />, {
    ...size,
  });
}
