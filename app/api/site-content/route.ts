import { NextResponse } from "next/server";

import { getSiteContent, updateGameRecord } from "@/lib/site-content";

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json(content);
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as {
    slug?: string;
    patch?: Record<string, unknown>;
  };

  if (!body.slug || !body.patch) {
    return NextResponse.json(
      { message: "slug and patch are required" },
      { status: 400 },
    );
  }

  await updateGameRecord(undefined, body.slug, body.patch);

  return NextResponse.json({ ok: true });
}
