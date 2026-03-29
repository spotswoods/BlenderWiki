import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../.env') })

const client = createClient({
  projectId: 's6i6ussl',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

// ── Helpers ──────────────────────────────────────────────────────────────────

let _counter = 0
function uid() { return `sx${++_counter}` }

function block(text) {
  return {
    _type: 'block', _key: uid(),
    style: 'normal', markDefs: [],
    children: [{ _type: 'span', _key: uid(), text, marks: [] }],
  }
}

function ref(id) {
  return { _type: 'reference', _ref: id, _key: uid() }
}

// ── Categories ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { _id: 'seed-cat-modify',         title: 'Modify Modifiers',  slug: 'modify',          sortOrder: 0 },
  { _id: 'seed-cat-geometry-nodes', title: 'Geometry Nodes',    slug: 'geometry-nodes',  sortOrder: 5 },
]

// ── Gotchas ───────────────────────────────────────────────────────────────────

const GOTCHAS = [
  {
    _id: 'seed-gotcha-uv-unwrap',
    internalName: 'gotcha_uv_unwrap',
    symptom: 'My texture is stretching or looks smeared across the mesh.',
    solution: [
      block("You need to UV unwrap your mesh first. Without a UV map, Blender doesn't know how to project the 2D texture onto the 3D surface, so it guesses — and usually gets it wrong."),
      block("Fix: In Edit Mode, select all with A, then press U to open the UV Mapping menu. Choose Smart UV Project for a quick automatic unwrap, or Unwrap for a more precise result. Then check the result in the UV Editor."),
    ],
  },
  {
    _id: 'seed-gotcha-drivers-needed',
    internalName: 'gotcha_drivers',
    symptom: 'My geometry nodes setup works but nothing is animatable from the outside.',
    solution: [
      block("Geometry nodes inputs are not automatically exposed as animatable properties. You need to expose them via the modifier panel first, then drive or keyframe those inputs from outside the node tree."),
      block("Fix: In the Geometry Nodes modifier panel, click the icon next to any input to expose it as a modifier property. Then right-click the exposed value and choose Add Driver or Insert Keyframe to animate it from the timeline or Graph Editor."),
    ],
  },
]

// ── Reference Pages ───────────────────────────────────────────────────────────

const flags = { needsHero: true, needsUI: true, needsExamples: true }

const PAGES = [
  // ── Modify Modifiers ──────────────────────────────────────────────────────
  {
    _id: 'seed-page-data-transfer',
    title: 'Data Transfer', slug: 'data-transfer', cat: 'seed-cat-modify',
    hotkeys: [],
    tldr: 'Copies vertex data (normals, UVs, weights) from one mesh to another — used to transfer baked normals onto a game-ready mesh.',
    gotchas: ['seed-gotcha-apply-scale'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/modify/data_transfer.html',
  },
  {
    _id: 'seed-page-weighted-normal',
    title: 'Weighted Normal', slug: 'weighted-normal', cat: 'seed-cat-modify',
    hotkeys: [],
    tldr: 'Cleans up shading on hard-surface models by making face normals consistent — fixes dark spots on flat surfaces.',
    gotchas: ['seed-gotcha-check-normals'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/modify/weighted_normal.html',
  },
  {
    _id: 'seed-page-uv-project',
    title: 'UV Project', slug: 'uv-project', cat: 'seed-cat-modify',
    hotkeys: [],
    tldr: 'Projects UVs onto your mesh from the view of a camera or empty — for decals, logos, and projected textures.',
    gotchas: ['seed-gotcha-uv-unwrap'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/modify/uv_project.html',
  },
  {
    _id: 'seed-page-vertex-weight-edit',
    title: 'Vertex Weight Edit', slug: 'vertex-weight-edit', cat: 'seed-cat-modify',
    hotkeys: [],
    tldr: 'Modifies vertex group weights using a curve or texture — fine-tune which parts of a mesh get affected by a modifier.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/modify/vertex_weight_edit.html',
  },
  {
    _id: 'seed-page-mesh-cache',
    title: 'Mesh Cache', slug: 'mesh-cache', cat: 'seed-cat-modify',
    hotkeys: [],
    tldr: 'Loads animated mesh data from an external file — use it to import simulations from other software like Houdini.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/modify/mesh_cache.html',
  },
  {
    _id: 'seed-page-normal-edit',
    title: 'Normal Edit', slug: 'normal-edit', cat: 'seed-cat-modify',
    hotkeys: [],
    tldr: 'Manually overrides face normals to point toward a target — used to fake smooth shading on flat panels and stylized objects.',
    gotchas: ['seed-gotcha-check-normals'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/modify/normal_edit.html',
  },

  // ── More Deform Modifiers ─────────────────────────────────────────────────
  {
    _id: 'seed-page-laplacian-smooth',
    title: 'Laplacian Smooth', slug: 'laplacian-smooth', cat: 'seed-cat-deform',
    hotkeys: [],
    tldr: 'Smooths mesh shape while preserving sharp features better than regular smooth — good for organic models.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/deform/laplacian_smooth.html',
  },
  {
    _id: 'seed-page-surface-deform',
    title: 'Surface Deform', slug: 'surface-deform', cat: 'seed-cat-deform',
    hotkeys: [],
    tldr: 'Binds one mesh to deform along with another — make clothing follow a character body without needing weight painting.',
    gotchas: ['seed-gotcha-apply-scale'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/deform/surface_deform.html',
  },
  {
    _id: 'seed-page-mesh-deform',
    title: 'Mesh Deform', slug: 'mesh-deform', cat: 'seed-cat-deform',
    hotkeys: [],
    tldr: 'Deforms a mesh using a surrounding cage mesh — more precise control than Lattice for complex organic shapes.',
    gotchas: ['seed-gotcha-apply-scale'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/deform/mesh_deform.html',
  },
  {
    _id: 'seed-page-warp',
    title: 'Warp', slug: 'warp', cat: 'seed-cat-deform',
    hotkeys: [],
    tldr: 'Stretches mesh geometry between two objects — bends, pulls, and distorts regions of a mesh non-destructively.',
    gotchas: ['seed-gotcha-origin-point'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/deform/warp.html',
  },

  // ── More Physics ──────────────────────────────────────────────────────────
  {
    _id: 'seed-page-dynamic-paint',
    title: 'Dynamic Paint', slug: 'dynamic-paint', cat: 'seed-cat-physics',
    hotkeys: [],
    tldr: 'Records where objects touch a surface over time as painted color or displacement — footprints, wet trails, and impact marks.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/physics/dynamic_paint/index.html',
  },
  {
    _id: 'seed-page-explode',
    title: 'Explode', slug: 'explode', cat: 'seed-cat-physics',
    hotkeys: [],
    tldr: 'Breaks a mesh apart along particle paths — the fastest way to create explosion and shattering effects.',
    gotchas: ['seed-gotcha-apply-scale'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/physics/explode.html',
  },

  // ── More Shader Nodes ─────────────────────────────────────────────────────
  {
    _id: 'seed-page-glass-bsdf',
    title: 'Glass BSDF', slug: 'glass-bsdf', cat: 'seed-cat-shader',
    hotkeys: ['Shift', 'A'],
    tldr: 'A ready-made glass shader — handles refraction and reflection automatically. Use IOR to control how much it bends light.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/render/shader_nodes/shader/glass.html',
  },
  {
    _id: 'seed-page-glossy-bsdf',
    title: 'Glossy BSDF', slug: 'glossy-bsdf', cat: 'seed-cat-shader',
    hotkeys: ['Shift', 'A'],
    tldr: 'A pure mirror-like reflection shader. Roughness 0 = perfect mirror, Roughness 1 = completely dull. Mix with Diffuse for metals.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/render/shader_nodes/shader/glossy.html',
  },
  {
    _id: 'seed-page-diffuse-bsdf',
    title: 'Diffuse BSDF', slug: 'diffuse-bsdf', cat: 'seed-cat-shader',
    hotkeys: ['Shift', 'A'],
    tldr: 'A flat matte shader with no reflections — clay, chalk, and unfinished concrete. Simpler and faster than Principled BSDF.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/render/shader_nodes/shader/diffuse.html',
  },
  {
    _id: 'seed-page-transparent-bsdf',
    title: 'Transparent BSDF', slug: 'transparent-bsdf', cat: 'seed-cat-shader',
    hotkeys: ['Shift', 'A'],
    tldr: 'Makes a surface fully see-through without any refraction — use it for alpha cutouts, leaves, and hair cards.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/render/shader_nodes/shader/transparent.html',
  },
  {
    _id: 'seed-page-subsurface-scattering',
    title: 'Subsurface Scattering', slug: 'subsurface-scattering', cat: 'seed-cat-shader',
    hotkeys: ['Shift', 'A'],
    tldr: 'Simulates light passing through and scattering inside a material — essential for realistic skin, wax, and jade.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/render/shader_nodes/shader/sss.html',
  },
  {
    _id: 'seed-page-texture-coordinate',
    title: 'Texture Coordinate', slug: 'texture-coordinate', cat: 'seed-cat-shader',
    hotkeys: ['Shift', 'A'],
    tldr: 'Outputs different coordinate systems for positioning textures — UV, Object, World, and Camera space all in one node.',
    gotchas: ['seed-gotcha-uv-unwrap'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/render/shader_nodes/input/texture_coordinate.html',
  },
  {
    _id: 'seed-page-mapping',
    title: 'Mapping', slug: 'mapping', cat: 'seed-cat-shader',
    hotkeys: ['Shift', 'A'],
    tldr: 'Moves, rotates, and scales a texture — connect it between Texture Coordinate and any texture node to position it precisely.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/render/shader_nodes/vector/mapping.html',
  },
  {
    _id: 'seed-page-math',
    title: 'Math', slug: 'math', cat: 'seed-cat-shader',
    hotkeys: ['Shift', 'A'],
    tldr: 'Performs arithmetic on number values — add, multiply, clamp, power, sin/cos. The calculator of the shader node editor.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/render/shader_nodes/converter/math.html',
  },
  {
    _id: 'seed-page-mix-rgb',
    title: 'Mix Color', slug: 'mix-color', cat: 'seed-cat-shader',
    hotkeys: ['Shift', 'A'],
    tldr: 'Blends two colors or textures together using blend modes like Multiply, Screen, Overlay — identical to Photoshop layer blending.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/render/shader_nodes/color/mix.html',
  },
  {
    _id: 'seed-page-voronoi-texture',
    title: 'Voronoi Texture', slug: 'voronoi-texture', cat: 'seed-cat-shader',
    hotkeys: ['Shift', 'A'],
    tldr: 'Generates a cell-pattern texture — use it for scales, cracked mud, alien skin, and stylized abstract surfaces.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/render/shader_nodes/textures/voronoi.html',
  },
  {
    _id: 'seed-page-wave-texture',
    title: 'Wave Texture', slug: 'wave-texture', cat: 'seed-cat-shader',
    hotkeys: ['Shift', 'A'],
    tldr: 'Generates striped or ringed wave patterns — wood grain, zebra stripes, fingerprints, and topographic line effects.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/render/shader_nodes/textures/wave.html',
  },
  {
    _id: 'seed-page-musgrave-texture',
    title: 'Musgrave Texture', slug: 'musgrave-texture', cat: 'seed-cat-shader',
    hotkeys: ['Shift', 'A'],
    tldr: 'Generates detailed fractal noise — more complex than Noise Texture, great for terrain, rust, and organic surfaces.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/render/shader_nodes/textures/musgrave.html',
  },

  // ── Geometry Nodes ────────────────────────────────────────────────────────
  {
    _id: 'seed-page-gn-join-geometry',
    title: 'Join Geometry', slug: 'join-geometry', cat: 'seed-cat-geometry-nodes',
    hotkeys: ['Shift', 'A'],
    tldr: 'Merges multiple geometry inputs into one — the geometry node equivalent of Ctrl+J to join objects.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/geometry_nodes/geometry/join_geometry.html',
  },
  {
    _id: 'seed-page-gn-transform',
    title: 'Transform Geometry', slug: 'transform-geometry', cat: 'seed-cat-geometry-nodes',
    hotkeys: ['Shift', 'A'],
    tldr: 'Moves, rotates, and scales geometry inside a node tree — positions things without touching object transforms.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/geometry_nodes/geometry/transform_geometry.html',
  },
  {
    _id: 'seed-page-gn-instance-on-points',
    title: 'Instance on Points', slug: 'instance-on-points', cat: 'seed-cat-geometry-nodes',
    hotkeys: ['Shift', 'A'],
    tldr: 'Places copies of an object at every point of another mesh — scatter rocks on terrain, leaves on a branch, bolts on a panel.',
    gotchas: ['seed-gotcha-realize-instances'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/geometry_nodes/instances/instance_on_points.html',
  },
  {
    _id: 'seed-page-gn-set-position',
    title: 'Set Position', slug: 'set-position', cat: 'seed-cat-geometry-nodes',
    hotkeys: ['Shift', 'A'],
    tldr: 'Moves individual points of a mesh using a value or vector — the foundation of geometry node deformation and animation.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/geometry_nodes/geometry/set_position.html',
  },
  {
    _id: 'seed-page-gn-grid',
    title: 'Grid', slug: 'grid', cat: 'seed-cat-geometry-nodes',
    hotkeys: ['Shift', 'A'],
    tldr: 'Creates a flat plane subdivided into rows and columns — the starting point for terrain, water planes, and cloth sims.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/geometry_nodes/mesh/primitives/grid.html',
  },
  {
    _id: 'seed-page-gn-mesh-line',
    title: 'Mesh Line', slug: 'mesh-line', cat: 'seed-cat-geometry-nodes',
    hotkeys: ['Shift', 'A'],
    tldr: 'Creates a line of vertices between two points — use it as the spine for instancing or as input to a curve modifier.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/geometry_nodes/mesh/primitives/line.html',
  },
  {
    _id: 'seed-page-gn-distribute-points',
    title: 'Distribute Points on Faces', slug: 'distribute-points-on-faces', cat: 'seed-cat-geometry-nodes',
    hotkeys: ['Shift', 'A'],
    tldr: 'Scatters points across a mesh surface randomly or evenly — the foundation for scattering grass, rocks, and debris.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/geometry_nodes/point/distribute_points_on_faces.html',
  },
  {
    _id: 'seed-page-gn-realize-instances',
    title: 'Realize Instances', slug: 'realize-instances', cat: 'seed-cat-geometry-nodes',
    hotkeys: ['Shift', 'A'],
    tldr: 'Converts lightweight instances into actual geometry — required before you can edit, sculpt, or export individual copies.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/geometry_nodes/instances/realize_instances.html',
  },
  {
    _id: 'seed-page-gn-curve-to-mesh',
    title: 'Curve to Mesh', slug: 'curve-to-mesh', cat: 'seed-cat-geometry-nodes',
    hotkeys: ['Shift', 'A'],
    tldr: 'Sweeps a profile shape along a curve path — create pipes, cables, rails, and molding with a single node.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/geometry_nodes/curve/operations/curve_to_mesh.html',
  },
  {
    _id: 'seed-page-gn-noise-texture',
    title: 'Noise Texture (GN)', slug: 'noise-texture-gn', cat: 'seed-cat-geometry-nodes',
    hotkeys: ['Shift', 'A'],
    tldr: 'Generates procedural noise inside a geometry node tree — drive position offsets, scale variation, and color randomness.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/geometry_nodes/texture/noise.html',
  },
]

// ── Run ───────────────────────────────────────────────────────────────────────

async function run() {
  console.log('🌱 Starting extended seed...\n')

  // Categories
  console.log('📁 Creating categories...')
  for (const cat of CATEGORIES) {
    await client.createOrReplace({
      _id: cat._id, _type: 'category',
      title: cat.title,
      slug: { _type: 'slug', current: cat.slug },
      sortOrder: cat.sortOrder,
    })
    console.log(`  ✓ ${cat.title}`)
  }

  // Gotchas
  console.log('\n⚠️  Creating gotchas...')
  for (const g of GOTCHAS) {
    await client.createOrReplace({
      _id: g._id, _type: 'gotcha',
      internalName: g.internalName,
      symptom: g.symptom,
      solution: g.solution,
    })
    console.log(`  ✓ ${g.internalName}`)
  }

  // Pages
  console.log('\n📄 Creating reference pages...')
  for (const p of PAGES) {
    const doc = {
      _id: p._id, _type: 'referencePage',
      title: p.title,
      slug: { _type: 'slug', current: p.slug },
      category: { _type: 'reference', _ref: p.cat },
      tldr: p.tldr,
      hotkeys: p.hotkeys,
      docsUrl: p.docsUrl,
      trackerFlags: flags,
      linkedGotchas: p.gotchas.map(id => ref(id)),
    }
    await client.createOrReplace(doc)
    console.log(`  ✓ ${p.title}`)
  }

  const total = CATEGORIES.length + GOTCHAS.length + PAGES.length
  console.log(`\n✅ Done! Created ${total} documents.`)
  console.log(`   ${CATEGORIES.length} categories · ${GOTCHAS.length} gotchas · ${PAGES.length} pages`)
}

run().catch(err => { console.error('❌ Seed failed:', err.message); process.exit(1) })
