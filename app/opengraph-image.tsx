import { ImageResponse } from "next/og";

import { SocialCard } from "@/components/social-card";
import { getSiteSocialCardData } from "@/lib/social-image";

export const alt = "TurboArcade free browser games for quick breaks";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<SocialCard card={getSiteSocialCardData()} />, {
    ...size,
  });
}
