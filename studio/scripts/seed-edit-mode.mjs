import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../.env') })

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

let _c = 0
function uid() { return `em${++_c}` }
function block(text) {
  return {
    _type: 'block', _key: uid(), style: 'normal', markDefs: [],
    children: [{ _type: 'span', _key: uid(), text, marks: [] }],
  }
}

// ── Category ─────────────────────────────────────────────────────────────────

const CATEGORY = {
  _id: 'seed-cat-edit-mode',
  _type: 'category',
  title: 'Edit Mode Tools',
  slug: { _type: 'slug', current: 'edit-mode' },
  sortOrder: 10,
}

// ── Gotchas specific to Edit Mode ─────────────────────────────────────────────

const GOTCHAS = [
  {
    _id: 'seed-gotcha-extrude-in-place',
    _type: 'gotcha',
    internalName: 'gotcha_extrude_in_place',
    symptom: 'I extruded but the mesh looks the same — or it looks doubled up with dark shading.',
    solution: [
      block("You extruded but immediately right-clicked or pressed Escape to cancel the move — this leaves a duplicate set of faces sitting exactly on top of the original. The extrusion happened, but the move was cancelled."),
      block("Fix: Press Ctrl+Z to undo, then extrude again with E and immediately move the mouse before confirming. Alternatively, select all with A and use Merge by Distance (M → By Distance) to collapse the overlapping verts."),
    ],
  },
  {
    _id: 'seed-gotcha-loop-cut-ngon',
    _type: 'gotcha',
    internalName: 'gotcha_loop_cut_ngon',
    symptom: 'Loop Cut (Ctrl+R) is not showing a preview line, or the cut stops partway around the mesh.',
    solution: [
      block("Loop Cut requires a complete loop of quads (4-sided faces) to travel around. If your mesh has any triangles or n-gons (faces with 5+ sides) in the path, the loop terminates there."),
      block("Fix: Identify the problem faces using Overlay → Face Orientation or select faces and check the face count in the status bar. Clean up triangles by dissolving edges (Ctrl+X) or merging vertices, then retry the loop cut."),
    ],
  },
  {
    _id: 'seed-gotcha-inset-individual',
    _type: 'gotcha',
    internalName: 'gotcha_inset_individual',
    symptom: 'Inset is merging all my selected faces together instead of insetting each one separately.',
    solution: [
      block("By default, Inset operates on the boundary of your entire selection as one region. To inset each face individually, press I to start Inset then immediately press I again to toggle Individual mode."),
    ],
  },
  {
    _id: 'seed-gotcha-knife-confirm',
    _type: 'gotcha',
    internalName: 'gotcha_knife_confirm',
    symptom: 'I drew a cut with the Knife tool but nothing happened when I moved away.',
    solution: [
      block("The Knife tool requires explicit confirmation — it does not apply cuts automatically when you click elsewhere. After drawing your cut lines, press Enter or Space to confirm. Press Escape or right-click to cancel without cutting."),
    ],
  },
]

const flags = { needsHero: true, needsUI: true, needsExamples: true }
const cat = 'seed-cat-edit-mode'

// ── Pages ─────────────────────────────────────────────────────────────────────
// Every TLDR and description makes clear these are direct Edit Mode operations —
// destructive, immediate, and separate from any modifier of the same name.

const PAGES = [
  {
    _id: 'seed-page-em-extrude',
    title: 'Extrude',
    slug: 'extrude',
    hotkeys: ['E'],
    tldr: 'Pulls new geometry out of selected faces, edges, or vertices — the single most-used Edit Mode tool for building shapes.',
    gotchas: ['seed-gotcha-extrude-in-place'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/meshes/editing/mesh/extrude.html',
  },
  {
    _id: 'seed-page-em-inset',
    title: 'Inset Faces',
    slug: 'inset-faces',
    hotkeys: ['I'],
    tldr: 'Creates a smaller face inside a selected face — use it to add detail panels, windows, and recessed surfaces.',
    gotchas: ['seed-gotcha-inset-individual'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/meshes/editing/face/inset_faces.html',
  },
  {
    _id: 'seed-page-em-bevel-tool',
    title: 'Bevel Tool',
    slug: 'bevel-tool',
    hotkeys: ['Ctrl', 'B'],
    tldr: 'Rounds selected edges interactively in Edit Mode — drag to set width, scroll wheel to add segments. This permanently changes the mesh, unlike the Bevel Modifier.',
    gotchas: ['seed-gotcha-apply-scale'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/meshes/editing/edge/bevel.html',
  },
  {
    _id: 'seed-page-em-loop-cut',
    title: 'Loop Cut',
    slug: 'loop-cut',
    hotkeys: ['Ctrl', 'R'],
    tldr: 'Adds a new edge loop around a mesh — the main way to add resolution exactly where you need it without touching the rest.',
    gotchas: ['seed-gotcha-loop-cut-ngon'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/meshes/editing/edge/loop_cut_slide.html',
  },
  {
    _id: 'seed-page-em-knife',
    title: 'Knife',
    slug: 'knife',
    hotkeys: ['K'],
    tldr: 'Draws freehand cuts across faces — place vertices exactly where you need them for precise topology control.',
    gotchas: ['seed-gotcha-knife-confirm'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/meshes/editing/mesh/knife_tool.html',
  },
  {
    _id: 'seed-page-em-bridge-edge-loops',
    title: 'Bridge Edge Loops',
    slug: 'bridge-edge-loops',
    hotkeys: [],
    tldr: 'Connects two separate edge loops with a band of new faces — joins open ends of tubes, fills between holes, and creates handles.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/meshes/editing/edge/bridge_edge_loops.html',
  },
  {
    _id: 'seed-page-em-fill',
    title: 'Fill',
    slug: 'fill',
    hotkeys: ['F'],
    tldr: 'Creates a face from selected edges or vertices — the quickest way to close a hole or cap an open edge loop.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/meshes/editing/face/fill.html',
  },
  {
    _id: 'seed-page-em-grid-fill',
    title: 'Grid Fill',
    slug: 'grid-fill',
    hotkeys: [],
    tldr: 'Fills an even, circular edge loop with a clean grid of quads — the right way to cap a cylinder without a messy n-gon.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/meshes/editing/face/grid_fill.html',
  },
  {
    _id: 'seed-page-em-merge',
    title: 'Merge',
    slug: 'merge',
    hotkeys: ['M'],
    tldr: 'Collapses selected vertices into one point — use it to close tips, weld seams, and clean up stray vertices.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/meshes/editing/mesh/merge.html',
  },
  {
    _id: 'seed-page-em-subdivide',
    title: 'Subdivide',
    slug: 'subdivide',
    hotkeys: [],
    tldr: 'Splits every selected face into smaller faces — adds resolution permanently. Use Subdivision Surface modifier instead if you want it to stay non-destructive.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/meshes/editing/edge/subdivide.html',
  },
  {
    _id: 'seed-page-em-dissolve',
    title: 'Dissolve',
    slug: 'dissolve',
    hotkeys: ['Ctrl', 'X'],
    tldr: 'Removes edges or vertices without leaving a hole — merges the surrounding faces together. Cleaner than Delete for tidying up edge loops.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/meshes/editing/mesh/dissolve.html',
  },
  {
    _id: 'seed-page-em-separate',
    title: 'Separate',
    slug: 'separate',
    hotkeys: ['P'],
    tldr: 'Splits selected geometry into its own object — the opposite of Ctrl+J join. Use it to break a mesh into separate manageable parts.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/meshes/editing/mesh/separate.html',
  },
  {
    _id: 'seed-page-em-rip',
    title: 'Rip',
    slug: 'rip',
    hotkeys: ['V'],
    tldr: 'Tears vertices or edges away from the mesh, creating an open seam — useful for splitting topology without deleting geometry.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/meshes/editing/vertex/rip_vertices.html',
  },
  {
    _id: 'seed-page-em-vertex-slide',
    title: 'Vertex / Edge Slide',
    slug: 'vertex-edge-slide',
    hotkeys: ['G', 'G'],
    tldr: 'Slides a vertex or edge along its connected edges — repositions topology without changing the overall shape of the mesh.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/meshes/editing/vertex/slide_vertices.html',
  },
  {
    _id: 'seed-page-em-shrink-fatten',
    title: 'Shrink / Fatten',
    slug: 'shrink-fatten',
    hotkeys: ['Alt', 'S'],
    tldr: 'Moves selected vertices inward or outward along their face normals — inflates or deflates a shape evenly without distorting it.',
    gotchas: ['seed-gotcha-check-normals'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/meshes/editing/mesh/transform/shrink_fatten.html',
  },
  {
    _id: 'seed-page-em-proportional-editing',
    title: 'Proportional Editing',
    slug: 'proportional-editing',
    hotkeys: ['O'],
    tldr: 'Makes nearby vertices follow a transformation with a smooth falloff — sculpt-like edits without leaving Edit Mode.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/editors/3dview/controls/proportional_editing.html',
  },
  {
    _id: 'seed-page-em-edge-crease',
    title: 'Edge Crease',
    slug: 'edge-crease',
    hotkeys: ['Shift', 'E'],
    tldr: 'Marks an edge to stay sharp when Subdivision Surface smooths the mesh — control exactly which edges stay hard without adding extra loops.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/meshes/editing/edge/edge_data.html',
  },
  {
    _id: 'seed-page-em-mark-seam',
    title: 'Mark Seam',
    slug: 'mark-seam',
    hotkeys: [],
    tldr: 'Marks edges as UV seams — tells Blender where to cut the mesh open when unwrapping it flat for texturing.',
    gotchas: ['seed-gotcha-uv-unwrap'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/meshes/editing/edge/edge_data.html',
  },
  {
    _id: 'seed-page-em-spin',
    title: 'Spin',
    slug: 'spin',
    hotkeys: [],
    tldr: 'Rotates and duplicates selected geometry around the 3D cursor in steps — creates fan blades, spiral staircases, and radial patterns in Edit Mode.',
    gotchas: ['seed-gotcha-origin-point'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/meshes/editing/mesh/spin.html',
  },
]

// ── Run ───────────────────────────────────────────────────────────────────────

async function run() {
  console.log('🌱 Seeding Edit Mode Tools...\n')

  console.log('📁 Creating category...')
  await client.createOrReplace(CATEGORY)
  console.log('  ✓ Edit Mode Tools')

  console.log('\n⚠️  Creating gotchas...')
  for (const g of GOTCHAS) {
    await client.createOrReplace(g)
    console.log(`  ✓ ${g.internalName}`)
  }

  console.log('\n📄 Creating reference pages...')
  for (const p of PAGES) {
    await client.createOrReplace({
      _id: p._id,
      _type: 'referencePage',
      title: p.title,
      slug: { _type: 'slug', current: p.slug },
      category: { _type: 'reference', _ref: cat },
      versionTags: ['4.2', '5.x'],
      tldr: p.tldr,
      hotkeys: p.hotkeys,
      docsUrl: p.docsUrl,
      trackerFlags: flags,
      linkedGotchas: p.gotchas.map(id => ({ _type: 'reference', _ref: id, _key: uid() })),
    })
    console.log(`  ✓ ${p.title}`)
  }

  const total = 1 + GOTCHAS.length + PAGES.length
  console.log(`\n✅ Done! Created ${total} documents.`)
  console.log(`   1 category · ${GOTCHAS.length} gotchas · ${PAGES.length} pages`)
}

run().catch(err => { console.error('❌ Failed:', err.message); process.exit(1) })
