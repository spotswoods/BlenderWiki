"use client";

import { useState } from "react";
import { PortableText } from "@portabletext/react";
import type { Gotcha } from "@/lib/types";
import { urlFor } from "@/lib/sanity";

interface Props {
  gotcha: Gotcha;
}

export default function GotchaCard({ gotcha }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-yellow-800/50 bg-yellow-900/10 overflow-hidden">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full text-left px-5 py-4 flex items-start gap-3 hover:bg-yellow-900/20 transition-colors"
      >
        <span className="text-yellow-400 text-lg mt-0.5 shrink-0">⚠️</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-yellow-200 leading-snug">{gotcha.symptom}</p>
        </div>
        <span className="text-yellow-600 shrink-0 mt-1">{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-yellow-800/30">
          <div className="prose prose-sm prose-invert max-w-none text-[#d4d4d4] pt-4">
            {Array.isArray(gotcha.solution) ? (
              <PortableText value={gotcha.solution} />
            ) : (
              <p>{gotcha.solution as unknown as string}</p>
            )}
          </div>

          {gotcha.visualAid?.asset && (
            <div className="rounded-lg overflow-hidden border border-[#363636]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={urlFor(gotcha.visualAid).width(600).url()}
                alt="Visual fix demonstration"
                className="w-full max-w-md"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
