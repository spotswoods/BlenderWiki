"use client";

import { urlFor } from "@/lib/sanity";
import type { SanityMedia } from "@/lib/types";

export interface Hotspot {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  label: string;
  description: string;
}

interface Props {
  image: SanityMedia;
  title: string;
  hotspots?: Hotspot[];
}

/**
 * Displays a UI screenshot with interactive hotspot dots.
 * Hotspot positions are stored as x/y percentages so they're resolution-independent.
 *
 * In the future, hotspots can be authored in Sanity by adding an array field
 * to the referencePage schema. For now we accept them as a prop.
 */
export default function HotspotImage({ image, title, hotspots = [] }: Props) {
  if (!image?.asset) return null;

  const src = urlFor(image).width(900).url();

  return (
    <div className="relative inline-block w-full rounded-xl overflow-hidden border border-[#363636] bg-[#0d0d0d]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`${title} settings panel`}
        className="w-full h-auto block"
      />

      {hotspots.map((hs, i) => (
        <div
          key={i}
          className="hotspot"
          style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
          tabIndex={0}
          role="button"
          aria-label={hs.label}
        >
          <div className="hotspot-tooltip">
            <p className="font-semibold text-[#e87d0d] mb-1">{hs.label}</p>
            <p className="text-[#d4d4d4]">{hs.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
