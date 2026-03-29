/**
 * Run: npm run search:index
 * Fetches all reference pages from Sanity and writes /public/search-index.json
 * Call this after deploying new content, or wire into next build via postbuild.
 */
const { createClient } = require("@sanity/client");
const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../.env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

const QUERY = `
  *[_type == "referencePage"] {
    _id,
    title,
    "slug": slug.current,
    tldr,
    versionTags,
    "category": category->title,
    "categorySlug": category->slug.current
  }
`;

async function main() {
  console.log("Fetching pages from Sanity...");
  const docs = await client.fetch(QUERY);
  console.log(`Fetched ${docs.length} pages.`);

  const outPath = path.join(__dirname, "../public/search-index.json");
  fs.writeFileSync(outPath, JSON.stringify(docs, null, 2));
  console.log(`Written to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
