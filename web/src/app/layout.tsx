import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: { default: "BlenderWiki", template: "%s | BlenderWiki" },
  description: "The visual, no-fluff reference for every Blender modifier, node, and tool.",
  openGraph: {
    type: "website",
    siteName: "BlenderWiki",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#1a1a1a] text-[#d4d4d4]">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
