/**
 * Adds plain-English descriptions to existing seeded categories.
 * Run: node scripts/seed-category-descriptions.mjs
 */
import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET ?? "production",
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// Maps seed document _id → description to add
const DESCRIPTIONS = [
  { _id: "seed-cat-generate",       description: "Add new geometry — arrays, mirrors, extrusions" },
  { _id: "seed-cat-deform",         description: "Bend, twist, and reshape existing geometry" },
  { _id: "seed-cat-modify",         description: "Clean up, remesh, and adjust mesh topology" },
  { _id: "seed-cat-physics",        description: "Simulate cloth, soft bodies, and collisions" },
  { _id: "seed-cat-shader-nodes",   description: "Control how a surface looks — colour, gloss, transparency" },
  { _id: "seed-cat-geometry-nodes", description: "Build and manipulate geometry procedurally" },
  { _id: "seed-cat-edit-mode",      description: "Direct mesh editing with in-viewport operations" },
];

async function run() {
  console.log("Adding descriptions to categories…\n");

  for (const { _id, description } of DESCRIPTIONS) {
    // Fetch the existing document first so we can createOrReplace without losing other fields
    const existing = await client.getDocument(_id);
    if (!existing) {
      console.log(`  ⚠ ${_id} not found — skipping`);
      continue;
    }

    await client.createOrReplace({
      ...existing,
      description,
    });

    console.log(`  ✓ ${_id} — "${description}"`);
  }

  console.log("\nDone.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
