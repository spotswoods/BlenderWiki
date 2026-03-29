import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contribute",
  description: "Help make BlenderWiki better — suggest improvements, flag confusing pages, or submit your own examples.",
};

export default function ContributePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-12 py-8">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold">Help make this better</h1>
        <p className="text-[#888] text-lg leading-relaxed">
          BlenderWiki is built on real feedback from real Blender users. If something&apos;s confusing, wrong, or missing &mdash; you can fix it.
        </p>
      </div>

      {/* Ways to contribute */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#555]">Ways to contribute</h2>

        {/* Flag a confusing page */}
        <div className="rounded-xl border border-[#2d2d2d] bg-[#1f1f1f] p-6 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤔</span>
            <h3 className="font-semibold text-lg">Flag a confusing page</h3>
          </div>
          <p className="text-[#888] text-sm leading-relaxed">
            Found a page that didn&apos;t make sense? Tell us what was confusing and what experience level you&apos;re at. Even saying &ldquo;I have no idea what this means&rdquo; is genuinely useful — it tells us the explanation isn&apos;t working.
          </p>
          <a
            href="https://github.com/spotswoods/blenderpage/issues/new?template=didnt-understand.yml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm bg-[#2a2a2a] border border-[#363636] hover:border-[#e87d0d]/60 hover:text-white rounded-lg px-4 py-2.5 transition-all"
          >
            Open &ldquo;I didn&apos;t understand this&rdquo; form ↗
          </a>
        </div>

        {/* Suggest improvement */}
        <div className="rounded-xl border border-[#2d2d2d] bg-[#1f1f1f] p-6 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✏️</span>
            <h3 className="font-semibold text-lg">Suggest a better explanation</h3>
          </div>
          <p className="text-[#888] text-sm leading-relaxed">
            Have a clearer way to explain what a modifier does? Write it in plain English — no jargon required. We review all suggestions and the best ones get published.
          </p>
          <a
            href="https://github.com/spotswoods/blenderpage/issues/new?template=suggest-improvement.yml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm bg-[#2a2a2a] border border-[#363636] hover:border-[#e87d0d]/60 hover:text-white rounded-lg px-4 py-2.5 transition-all"
          >
            Open suggestion form ↗
          </a>
        </div>

        {/* Submit example */}
        <div className="rounded-xl border border-[#2d2d2d] bg-[#1f1f1f] p-6 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📎</span>
            <h3 className="font-semibold text-lg">Submit an example or .blend file</h3>
          </div>
          <p className="text-[#888] text-sm leading-relaxed">
            Made a clean example of a modifier or tool in action? Share the .blend file and a short description of what you did. Good examples get added to the page directly.
          </p>
          <a
            href="https://github.com/spotswoods/blenderpage/issues/new?template=new-example.yml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm bg-[#2a2a2a] border border-[#363636] hover:border-[#e87d0d]/60 hover:text-white rounded-lg px-4 py-2.5 transition-all"
          >
            Open example submission form ↗
          </a>
        </div>

        {/* General discussion */}
        <div className="rounded-xl border border-[#2d2d2d] bg-[#1f1f1f] p-6 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💬</span>
            <h3 className="font-semibold text-lg">General ideas and discussion</h3>
          </div>
          <p className="text-[#888] text-sm leading-relaxed">
            Have a bigger idea — new categories, a different structure, or something that doesn&apos;t fit a form? Start a discussion on GitHub.
          </p>
          <a
            href="https://github.com/spotswoods/blenderpage/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm bg-[#2a2a2a] border border-[#363636] hover:border-[#e87d0d]/60 hover:text-white rounded-lg px-4 py-2.5 transition-all"
          >
            Open GitHub Discussions ↗
          </a>
        </div>
      </div>

      {/* How it works */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#555]">How submissions work</h2>
        <div className="rounded-xl border border-[#363636] bg-[#1f1f1f] divide-y divide-[#2a2a2a]">
          {[
            ["You submit",    "Fill out the form — it opens a GitHub issue pre-filled with the tool name. Takes about 2 minutes."],
            ["We review",     "Every submission gets read. Good explanations, real gotchas, and useful examples go straight into the queue."],
            ["It goes live",  "Accepted content gets added to Sanity Studio and published. Your contribution is credited in the GitHub issue thread."],
          ].map(([step, desc]) => (
            <div key={step} className="px-5 py-4 flex gap-4">
              <span className="text-[#e87d0d] font-bold shrink-0 w-20 text-sm">{step}</span>
              <p className="text-sm text-[#888] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* No GitHub? */}
      <div className="rounded-xl border border-[#2d2d2d] bg-[#1f1f1f] px-6 py-5 space-y-2">
        <p className="font-semibold text-sm">Don&apos;t have a GitHub account?</p>
        <p className="text-sm text-[#888] leading-relaxed">
          GitHub is free to sign up and you don&apos;t need any coding knowledge to open an issue. Alternatively, you can{" "}
          <a
            href="https://github.com/spotswoods/blenderpage"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#e87d0d] hover:underline"
          >
            view the project on GitHub ↗
          </a>{" "}
          and see what others have already suggested.
        </p>
      </div>

      <div className="pt-2">
        <Link href="/" className="text-sm text-[#555] hover:text-[#e87d0d] transition-colors">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
