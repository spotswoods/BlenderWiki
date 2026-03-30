import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to use BlenderWiki",
  description: "A quick guide to navigating BlenderWiki — what everything means and how to get the most out of it.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-[#555]">{title}</h2>
      {children}
    </section>
  );
}

function Card({ emoji, heading, children }: { emoji: string; heading: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#2d2d2d] bg-[#1f1f1f] p-5 space-y-2">
      <div className="flex items-center gap-3">
        <span className="text-xl">{emoji}</span>
        <h3 className="font-semibold">{heading}</h3>
      </div>
      <div className="text-sm text-[#888] leading-relaxed pl-8">{children}</div>
    </div>
  );
}

export default function GuidePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-14 py-8">

      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold">How to use BlenderWiki</h1>
        <p className="text-[#888] text-lg leading-relaxed">
          A plain-English reference for every Blender modifier, node, and tool. Here&apos;s how to navigate it.
        </p>
      </div>

      {/* What is this */}
      <Section title="What is this?">
        <div className="rounded-xl border border-[#e87d0d]/20 bg-[#e87d0d]/5 p-5 space-y-2 text-sm text-[#aaa] leading-relaxed">
          <p>
            BlenderWiki is a free, visual reference built for people learning Blender. The official docs are thorough but technical &mdash; this site explains things in plain English, shows short demos, and focuses on <em>when</em> you&apos;d actually use something, not just what it does.
          </p>
          <p>
            It covers modifiers, shader nodes, geometry nodes, and edit mode tools. Content is written for beginners first, with links to the official docs for anyone who wants more depth.
          </p>
        </div>
      </Section>

      {/* Anatomy of a tool page */}
      <Section title="What&apos;s on each tool page">
        <div className="space-y-3">
          <Card emoji="💬" heading="The TL;DR">
            One sentence under the title. If you only read one thing, read this &mdash; it tells you what the tool does and when you&apos;d reach for it.
          </Card>
          <Card emoji="⌨️" heading="Keyboard shortcut">
            Shown right under the title if this tool has one. Tools that can be triggered from the keyboard will show the key combination as a styled badge.
          </Card>
          <Card emoji="🎬" heading="Demo video">
            A short clip showing the tool in action &mdash; typically under 10 seconds. No talking, no intro, just the result. Some pages don&apos;t have one yet.
          </Card>
          <Card emoji="✅" heading="Common use cases">
            Real-world scenarios where this tool is the right choice. Each one has a short description and sometimes its own demo.
          </Card>
          <Card emoji="📸" heading="Settings Panel">
            A screenshot of the modifier&apos;s property panel in Blender. On pages with version history, you can switch between Blender versions using the pill buttons above the screenshot &mdash; useful when the UI changed between releases.
          </Card>
          <Card emoji="⚠️" heading="Common Gotchas">
            Things that trip people up. Each gotcha is a real problem with a real fix. Click to expand.
          </Card>
          <Card emoji="📎" heading="Practice .blend file">
            A downloadable Blender file with the exact setup shown on the page. Open it, poke around, and break things.
          </Card>
          <Card emoji="📖" heading="Official Docs link">
            At the bottom of each page &mdash; takes you to the Blender manual for the full technical reference if you want to go deeper.
          </Card>
        </div>
      </Section>

      {/* Version switching */}
      <Section title="Blender version switching">
        <div className="rounded-xl border border-[#2d2d2d] bg-[#1f1f1f] p-5 space-y-3 text-sm text-[#888] leading-relaxed">
          <p>
            Blender updates regularly and tool UIs sometimes change between versions. When a page has version history, you&apos;ll see small pill buttons above the Settings Panel screenshot:
          </p>
          <div className="flex items-center gap-2 py-1">
            <span className="text-xs font-mono rounded-full px-3 py-1 border bg-[#e87d0d] border-[#e87d0d] text-white">4.2 ★</span>
            <span className="text-xs font-mono rounded-full px-3 py-1 border bg-[#1a1a1a] border-[#363636] text-[#888]">4.1</span>
            <span className="text-xs font-mono rounded-full px-3 py-1 border bg-[#1a1a1a] border-[#363636] text-[#888]">3.6</span>
          </div>
          <p>
            Click any pill to see the settings screenshot for that version, along with a note about what changed. The starred version (★) is the one the page is primarily written for.
          </p>
          <p>
            If your version of Blender is older than the latest shown, check the older version&apos;s screenshot &mdash; some options may be missing or named differently.
          </p>
        </div>
      </Section>

      {/* How to search */}
      <Section title="Searching">
        <div className="space-y-3">
          <Card emoji="🔍" heading="Search by what you want to do">
            The search bar works best with plain-English phrases. Instead of &ldquo;boolean modifier&rdquo;, try &ldquo;cut a hole&rdquo; or &ldquo;subtract shapes&rdquo;. The search is fuzzy &mdash; close matches will still show up.
          </Card>
          <Card emoji="💡" heading="Browse by category">
            Not sure what it&apos;s called? Browse a category from the homepage. Each category has a short description of what kind of tools it contains.
          </Card>
        </div>
      </Section>

      {/* Categories explained */}
      <Section title="What the categories mean">
        <div className="rounded-xl border border-[#2d2d2d] bg-[#1f1f1f] divide-y divide-[#2a2a2a] text-sm">
          {[
            ["Generate Modifiers",  "Add new geometry to an object — things like arrays, mirrors, and extrusions. The object grows."],
            ["Deform Modifiers",    "Change the shape of existing geometry — bending, twisting, stretching. Nothing new is added."],
            ["Modify Modifiers",    "Clean up or restructure geometry — remeshing, smoothing, adjusting topology."],
            ["Physics Modifiers",   "Simulate real-world behaviour — cloth, soft bodies, collisions."],
            ["Shader Nodes",        "Control what a surface looks like — colour, roughness, transparency, emission."],
            ["Geometry Nodes",      "Build and manipulate geometry with a node graph instead of modifiers. Procedural and non-destructive."],
            ["Edit Mode Tools",     "Operations you do directly on a mesh in Edit Mode — bevel, loop cuts, extrusion. These are destructive (they change the mesh permanently)."],
          ].map(([cat, desc]) => (
            <div key={cat} className="px-5 py-4 flex gap-4">
              <span className="font-medium text-[#d4d4d4] shrink-0 w-44 text-xs leading-relaxed pt-0.5">{cat}</span>
              <p className="text-[#666] text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Content status */}
      <Section title="Content status">
        <div className="rounded-xl border border-[#2d2d2d] bg-[#1f1f1f] p-5 space-y-3 text-sm text-[#888] leading-relaxed">
          <p>
            This site is in early access. Most pages have the text explanation but are still missing demo videos, settings screenshots, and .blend files. These get added over time.
          </p>
          <p>
            If something is missing on a page you care about, you can flag it &mdash; see the buttons at the bottom of every tool page. The most-requested pages get updated first.
          </p>
        </div>
      </Section>

      {/* Contribute */}
      <Section title="Something wrong or missing?">
        <div className="rounded-xl border border-[#2d2d2d] bg-[#1f1f1f] p-5 flex items-center justify-between gap-4">
          <p className="text-sm text-[#888] leading-relaxed">
            Found a mistake, a confusing explanation, or want to submit a better example? Every tool page has feedback buttons, or visit the contribute page.
          </p>
          <Link
            href="/contribute"
            className="shrink-0 text-sm border border-[#363636] hover:border-[#e87d0d]/60 hover:text-white bg-[#2a2a2a] rounded-lg px-4 py-2 transition-all"
          >
            Contribute →
          </Link>
        </div>
      </Section>

      <div className="pt-2">
        <Link href="/" className="text-sm text-[#555] hover:text-[#e87d0d] transition-colors">
          ← Back to home
        </Link>
      </div>

    </div>
  );
}
