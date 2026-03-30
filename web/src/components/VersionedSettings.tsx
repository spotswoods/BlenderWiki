"use client";

import { useState } from "react";
import type { VersionEntry, SanityMedia } from "@/lib/types";
import HotspotImage from "./HotspotImage";

interface Props {
  /** The default (current) settings screenshot */
  defaultUI?: SanityMedia;
  /** Version history entries from Sanity */
  versions?: VersionEntry[];
  title: string;
  /** e.g. "4.2" — the version the main page is written for */
  targetVersion?: string;
}

export default function VersionedSettings({ defaultUI, versions, title, targetVersion }: Props) {
  const hasVersions = versions && versions.length > 0;

  // Build a unified list: the current version first, then history entries
  const allVersions = [
    {
      version: targetVersion ?? "Current",
      changes: null as string | null,
      settingsUI: defaultUI,
      isCurrent: true,
    },
    ...(versions ?? []).map((v) => ({
      version: v.version,
      changes: v.changes ?? null,
      settingsUI: v.settingsUI,
      isCurrent: false,
    })),
  ];

  const [selectedVersion, setSelectedVersion] = useState(allVersions[0].version);
  const active = allVersions.find((v) => v.version === selectedVersion) ?? allVersions[0];

  if (!hasVersions) {
    // No version history — just show the single UI or placeholder
    if (!defaultUI) {
      return (
        <div className="flex items-center gap-3 rounded-lg border border-dashed border-[#2d2d2d] px-5 py-3 text-sm text-[#555]">
          <span>📸</span>
          <span>Settings screenshot not yet added.</span>
        </div>
      );
    }
    return <HotspotImage image={defaultUI} title={title} />;
  }

  return (
    <div className="space-y-4">
      {/* Version pill switcher */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-[#555] mr-1">Blender version:</span>
        {allVersions.map((v) => (
          <button
            key={v.version}
            onClick={() => setSelectedVersion(v.version)}
            className={`text-xs font-mono rounded-full px-3 py-1 border transition-all ${
              selectedVersion === v.version
                ? "bg-[#e87d0d] border-[#e87d0d] text-white"
                : "bg-[#1f1f1f] border-[#363636] text-[#888] hover:border-[#e87d0d]/60 hover:text-white"
            }`}
          >
            {v.isCurrent && !v.version.match(/^\d/) ? "Latest" : v.version}
            {v.isCurrent && <span className="ml-1 opacity-60 text-[10px]">★</span>}
          </button>
        ))}
      </div>

      {/* Change note for older versions */}
      {active.changes && !active.isCurrent && (
        <div className="flex items-start gap-2 rounded-lg bg-[#1f1f1f] border border-[#363636] px-4 py-3 text-sm text-[#aaa]">
          <span className="shrink-0 mt-0.5">📋</span>
          <div>
            <span className="text-[#e87d0d] font-medium">Blender {active.version}: </span>
            {active.changes}
          </div>
        </div>
      )}

      {/* Screenshot or placeholder */}
      {active.settingsUI ? (
        <HotspotImage image={active.settingsUI} title={`${title} — Blender ${active.version}`} />
      ) : (
        <div className="flex items-center gap-3 rounded-lg border border-dashed border-[#2d2d2d] px-5 py-3 text-sm text-[#555]">
          <span>📸</span>
          <span>No screenshot for Blender {active.version} yet.</span>
        </div>
      )}
    </div>
  );
}
