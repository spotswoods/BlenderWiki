"use client";

import { urlFor } from "@/lib/sanity";
import type { SanityMedia } from "@/lib/types";

interface Props {
  media: SanityMedia;
  title: string;
}

export default function HeroMedia({ media, title }: Props) {
  if (!media?.asset) return null;

  // If it's a video (mp4) served from Sanity file URL
  const assetRef: string = media.asset._ref ?? "";
  const isVideo =
    assetRef.includes("-mp4") ||
    assetRef.includes("-webm") ||
    media.asset.url?.endsWith(".mp4") ||
    media.asset.url?.endsWith(".webm");

  if (isVideo) {
    const url = media.asset.url ?? "";
    return (
      <div className="rounded-xl overflow-hidden bg-[#0d0d0d] border border-[#363636] aspect-video">
        <video
          src={url}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          aria-label={`Demo of ${title}`}
        />
      </div>
    );
  }

  // Image (GIF or static)
  const src = urlFor(media).width(1200).url();
  return (
    <div className="rounded-xl overflow-hidden bg-[#0d0d0d] border border-[#363636]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={media.alt ?? title} className="w-full object-cover" />
    </div>
  );
}
