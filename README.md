# BlenderWiki

Visual, no-fluff Blender reference — built on Next.js + Sanity + Fuse.js.

## Project Structure

```
blenderpage/
├── web/        → Next.js frontend (deploy to Vercel)
└── studio/     → Sanity Studio (deploy with `sanity deploy`)
```

---

## 1 · Create your Sanity project (free)

1. Go to <https://www.sanity.io/manage> → **Create new project**
2. Name it `blender-wiki`, select dataset `production`
3. Copy your **Project ID**

---

## 2 · Configure environment variables

**`web/.env.local`**
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
```

**`studio/.env`**
```
SANITY_STUDIO_PROJECT_ID=your_project_id_here
SANITY_STUDIO_DATASET=production
```

---

## 3 · Run Sanity Studio

```bash
cd studio
npm install
npm run dev
# Opens http://localhost:3333
```

The studio sidebar shows:
- **Reference Pages** — your main wiki content
- **Gotchas** — reusable troubleshooting entries
- **Categories** — navigation structure
- 🔴 **Needs Hero Video** — tracker queue
- 🟡 **Needs UI Screenshot** — tracker queue
- 🔵 **Needs .Blend File** — tracker queue
- ✅ **Complete** — done pages

---

## 4 · Seed some content

In Sanity Studio:

1. **Create a Category** — e.g., `Generate Modifiers`, slug: `modifiers/generate`
2. **Create a Reference Page** — e.g., `Array`, link it to the category
3. **Create a Gotcha** — e.g., `Apply Scale`, link it to `Array`

---

## 5 · Build the search index

After adding content:

```bash
cd web
npm run search:index
```

This writes `public/search-index.json` — the Fuse.js fuzzy search source.
Re-run whenever you add/update pages. Wire into CI to automate.

---

## 6 · Run the web app

```bash
cd web
npm run dev
# Opens http://localhost:3000
```

---

## 7 · Deploy

### Vercel (frontend)
```bash
cd web
npx vercel
```
Set the env vars in the Vercel dashboard under **Settings → Environment Variables**.

### Sanity Studio
```bash
cd studio
npm run deploy
# Deploys to https://blender-wiki.sanity.studio
```

---

## Content Rules (Manifesto)

| Rule | Detail |
|------|--------|
| 5-second visual | Hero MP4 must show the tool doing its job in ≤5s, no intro |
| No default cubes | Use recognizable context (gear, staircase, not a cube) |
| UI as hotspots | Screenshot + CSS tooltip dots, not bullet lists |
| Plain English | "master shader node" not "BSDF computation" |
| Always .blend | Every page ships a downloadable .blend file |

---

## Adding Hotspots to a Settings Screenshot

In the reference page component (`HotspotImage.tsx`), pass a `hotspots` array:

```tsx
<HotspotImage
  image={page.settingsUI}
  title={page.title}
  hotspots={[
    { x: 42, y: 18, label: "Count", description: "Number of array copies to create." },
    { x: 42, y: 30, label: "Relative Offset", description: "Offsets each copy by a factor of the object's own size." },
  ]}
/>
```

Hotspot `x`/`y` are percentages of the image dimensions (0–100). Use browser DevTools to measure positions on the screenshot.

In the future, hotspot positions can be stored directly in Sanity by adding an array field to the `referencePage` schema.
