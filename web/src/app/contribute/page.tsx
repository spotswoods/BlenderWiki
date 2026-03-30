import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Contribute",
  description: "Help make BlenderWiki better — suggest improvements, flag confusing pages, or submit your own examples.",
};

const REPO = "spotswoods/BlenderWiki";

interface GitHubContributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

async function getContributors(): Promise<GitHubContributor[]> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/contributors?per_page=50`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function ContributePage() {
  const contributors = await getContributors();

  return (
    <div className="max-w-2xl mx-auto space-y-16 py-8">

      {/* Header */}
      <div className="space-y-4">
        <div className="inline-block text-xs font-semibold uppercase tracking-widest text-[#e87d0d] bg-[#e87d0d]/10 border border-[#e87d0d]/20 rounded-full px-3 py-1">
          Open contribution
        </div>
        <h1 className="text-4xl font-bold">Help make this better</h1>
        <p className="text-[#888] text-lg leading-relaxed">
          BlenderWiki is built on feedback from real Blender users. You don&apos;t need to be a developer &mdash; the most useful contributions are plain-English explanations and honest &ldquo;I didn&apos;t get this&rdquo; reports.
        </p>
      </div>

      {/* How it works */}
      <section className="space-y-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#555]">How it works</h2>
        <div className="relative">
          <div className="absolute left-[19px] top-10 bottom-10 w-px bg-[#2d2d2d]" />
          <div className="space-y-4">
            {[
              {
                n: "1",
                title: "Find something to improve",
                body: "Browse any tool page. Is the explanation confusing? Is the example missing? Is there a better way to say it? That is your contribution.",
              },
              {
                n: "2",
                title: "Open a form — takes 2 minutes",
                body: "Use one of the buttons below. Each opens a GitHub form pre-filled with structure so you know exactly what to write. No coding knowledge needed.",
              },
              {
                n: "3",
                title: "We review and publish",
                body: "Every submission gets read. Good explanations get added to the page directly. Your GitHub username appears in the contributors list on this page.",
              },
            ].map(({ n, title, body }) => (
              <div key={n} className="flex gap-5">
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#e87d0d] text-white font-bold text-sm flex items-center justify-center z-10">
                  {n}
                </div>
                <div className="bg-[#1f1f1f] border border-[#2d2d2d] rounded-xl px-5 py-4 flex-1 space-y-1">
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-[#888] leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contribution types */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#555]">What you can contribute</h2>
        <div className="space-y-3">
          {[
            {
              emoji: "🤔",
              title: "I did not understand a page",
              body: "Tell us which page confused you and what experience level you are at. Even saying you had no idea what it meant is useful.",
              label: "Open confusion report",
              href: `https://github.com/${REPO}/issues/new?labels=needs-improvement&title=Confusion+report:+`,
            },
            {
              emoji: "✏️",
              title: "I have a better explanation",
              body: "Write it in plain English — no jargon required. The best ones replace the current explanation on the page, and you get credited.",
              label: "Open suggestion form",
              href: `https://github.com/${REPO}/issues/new?labels=suggestion&title=Better+explanation:+`,
            },
            {
              emoji: "📎",
              title: "I have a .blend file or example",
              body: "Made a clean demo of a modifier or tool in action? Good examples get added to the page directly and linked as a downloadable file.",
              label: "Open example submission",
              href: `https://github.com/${REPO}/issues/new?labels=example&title=Example+submission:+`,
            },
            {
              emoji: "💬",
              title: "I have a bigger idea",
              body: "New category, different structure, something that does not fit a form? Start a discussion — these shape the direction of the site.",
              label: "Start a discussion",
              href: `https://github.com/${REPO}/discussions`,
            },
          ].map(({ emoji, title, body, label, href }) => (
            <div key={title} className="rounded-xl border border-[#2d2d2d] bg-[#1f1f1f] p-5 flex gap-4 items-start">
              <span className="text-2xl shrink-0 mt-0.5">{emoji}</span>
              <div className="flex-1 space-y-2 min-w-0">
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-[#888] leading-relaxed">{body}</p>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[#e87d0d] hover:text-white transition-colors font-medium"
                >
                  {label} ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* No GitHub callout */}
      <div className="rounded-xl border border-[#363636] bg-[#1a1a1a] px-5 py-4 flex gap-4 items-start">
        <span className="text-lg shrink-0">💡</span>
        <div className="space-y-1">
          <p className="text-sm font-semibold">Do not have a GitHub account?</p>
          <p className="text-sm text-[#888] leading-relaxed">
            GitHub is free to sign up and you do not need any coding knowledge to open an issue. Alternatively, use the feedback buttons at the bottom of any tool page.
          </p>
        </div>
      </div>

      {/* Contributors */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#555]">Contributors</h2>
          {contributors.length > 0 && (
            <a
              href={`https://github.com/${REPO}/graphs/contributors`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#555] hover:text-[#e87d0d] transition-colors"
            >
              View on GitHub ↗
            </a>
          )}
        </div>

        {contributors.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#2d2d2d] px-6 py-12 text-center space-y-3">
            <p className="text-3xl">🌱</p>
            <p className="font-semibold">Be the first contributor</p>
            <p className="text-sm text-[#666] max-w-xs mx-auto">
              This project is just getting started. Submit a suggestion above and your name will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {contributors.map((c) => (
              <a
                key={c.login}
                href={c.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-[#2d2d2d] bg-[#1f1f1f] px-4 py-3 hover:border-[#e87d0d]/40 hover:bg-[#252525] transition-all group"
              >
                <Image
                  src={c.avatar_url}
                  alt={c.login}
                  width={36}
                  height={36}
                  className="rounded-full shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-white transition-colors">
                    {c.login}
                  </p>
                  <p className="text-xs text-[#555]">
                    {c.contributions} {c.contributions === 1 ? "commit" : "commits"}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      <div className="pt-2">
        <Link href="/" className="text-sm text-[#555] hover:text-[#e87d0d] transition-colors">
          Back to home
        </Link>
      </div>

    </div>
  );
}
