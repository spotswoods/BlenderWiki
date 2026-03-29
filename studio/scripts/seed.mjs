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

// ── Helpers ──────────────────────────────────────────────────────────────────

function block(text) {
  return {
    _type: 'block', _key: uid(),
    style: 'normal', markDefs: [],
    children: [{ _type: 'span', _key: uid(), text, marks: [] }],
  }
}

function codeBlock(text) {
  return {
    _type: 'block', _key: uid(),
    style: 'normal', markDefs: [],
    children: [{ _type: 'span', _key: uid(), text, marks: ['code'] }],
  }
}

function ref(id) {
  return { _type: 'reference', _ref: id, _key: uid() }
}

let _counter = 0
function uid() { return `seed${++_counter}` }

// ── Categories ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { _id: 'seed-cat-generate', title: 'Generate Modifiers', slug: 'generate', sortOrder: 1 },
  { _id: 'seed-cat-deform',   title: 'Deform Modifiers',   slug: 'deform',   sortOrder: 2 },
  { _id: 'seed-cat-physics',  title: 'Physics Modifiers',  slug: 'physics',  sortOrder: 3 },
  { _id: 'seed-cat-shader',   title: 'Shader Nodes',       slug: 'shader-nodes', sortOrder: 4 },
]

// ── Gotchas ───────────────────────────────────────────────────────────────────

const GOTCHAS = [
  {
    _id: 'seed-gotcha-apply-scale',
    internalName: 'gotcha_apply_scale',
    symptom: 'My modifier looks squashed, stretched, or the wrong size.',
    solution: [
      block("You forgot to Apply Scale. Blender modifiers use your object's real-world dimensions — if you've scaled the object in Object Mode without applying it, the modifier sees a distorted version."),
      block("Fix: Select your object, press Ctrl + A in Object Mode, then choose Scale. The modifier will recalculate correctly."),
    ],
  },
  {
    _id: 'seed-gotcha-check-normals',
    internalName: 'gotcha_check_normals',
    symptom: 'My mesh has dark patches, inverted faces, or shading looks inside-out.',
    solution: [
      block("Your normals are flipped. Normals are invisible arrows that tell Blender which direction a face points — if they point inward, the face looks dark or invisible."),
      block("Fix: In Edit Mode, go to Overlay menu and enable Face Orientation to see blue (correct) vs red (flipped) faces. Then select all with A and press Shift + N to recalculate normals outward. Or manually flip selected faces with Alt + N → Flip."),
    ],
  },
  {
    _id: 'seed-gotcha-origin-point',
    internalName: 'gotcha_origin_point',
    symptom: 'My object is flying away from where I expect, or mirroring/arraying in the wrong direction.',
    solution: [
      block("The origin point of your object is in the wrong place. Many modifiers (Mirror, Array, Curve) work relative to the object's origin — a small orange dot usually at the center."),
      block("Fix: Select your object, right-click → Set Origin → Origin to Geometry to snap it to the center of the mesh. Or Origin to 3D Cursor to place it precisely."),
    ],
  },
  {
    _id: 'seed-gotcha-realize-instances',
    internalName: 'gotcha_realize_instances',
    symptom: 'Merge is not working, or I cannot edit individual copies from my Array.',
    solution: [
      block("Array creates instances (lightweight copies), not real geometry. Operations like Merge, sculpting, or vertex editing require real geometry."),
      block("Fix: In the Array modifier, enable Realize Instances. This converts all copies to real mesh data. Note: this increases memory usage proportional to copy count."),
    ],
  },
  {
    _id: 'seed-gotcha-non-manifold',
    internalName: 'gotcha_non_manifold',
    symptom: 'My Boolean modifier is producing holes, missing faces, or crashing.',
    solution: [
      block("Boolean requires watertight (manifold) geometry — every edge must be shared by exactly two faces, with no holes or internal faces."),
      block("Fix: In Edit Mode, go to Select → Select All by Trait → Non Manifold to highlight the problem areas. Common fixes: delete internal faces, fill holes with F, and remove duplicate vertices with M → By Distance."),
    ],
  },
  {
    _id: 'seed-gotcha-apply-before-sculpt',
    internalName: 'gotcha_apply_before_sculpt',
    symptom: 'I cannot sculpt or edit vertices on my subdivided / modified mesh.',
    solution: [
      block("Modifiers sit on top of the base mesh — Sculpt Mode and Edit Mode work on the original, not the modified result. You need to apply the modifier first to make the changes permanent."),
      block("Fix: In the Properties panel → Modifier tab, click Apply on the modifier. Warning: this is permanent and cannot be easily undone. Make a backup with Ctrl + D (linked duplicate) before applying if you want to keep the original."),
    ],
  },
]

// ── Reference Pages ───────────────────────────────────────────────────────────

const flags = { needsHero: true, needsUI: true, needsExamples: true }

const PAGES = [
  // ── Generate ──────────────────────────────────────────────────────────────
  {
    _id: 'seed-page-array', title: 'Array', slug: 'array', cat: 'seed-cat-generate',
    versions: ['4.2', '5.x'], hotkeys: [],
    tldr: 'Duplicates your object in a line, ring, or along a path — the fastest way to build fences, stairs, pillars, and anything repeating.',
    gotchas: ['seed-gotcha-apply-scale', 'seed-gotcha-origin-point', 'seed-gotcha-realize-instances'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/generate/array.html',
  },
  {
    _id: 'seed-page-bevel', title: 'Bevel', slug: 'bevel', cat: 'seed-cat-generate',
    versions: ['4.2', '5.x'], hotkeys: ['Ctrl', 'B'],
    tldr: 'Rounds off sharp edges and corners — essential for making hard-surface models look real instead of perfectly CG.',
    gotchas: ['seed-gotcha-apply-scale', 'seed-gotcha-check-normals'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/generate/bevel.html',
  },
  {
    _id: 'seed-page-boolean', title: 'Boolean', slug: 'boolean', cat: 'seed-cat-generate',
    versions: ['4.2', '5.x'], hotkeys: [],
    tldr: 'Cuts, joins, or finds the overlap of two meshes — use it to punch holes, merge shapes, or create complex cutouts.',
    gotchas: ['seed-gotcha-non-manifold', 'seed-gotcha-apply-scale', 'seed-gotcha-check-normals'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/generate/booleans.html',
  },
  {
    _id: 'seed-page-build', title: 'Build', slug: 'build', cat: 'seed-cat-generate',
    versions: ['4.2', '5.x'], hotkeys: [],
    tldr: 'Animates your mesh appearing or disappearing face-by-face over time — great for construction and destruction effects.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/generate/build.html',
  },
  {
    _id: 'seed-page-decimate', title: 'Decimate', slug: 'decimate', cat: 'seed-cat-generate',
    versions: ['4.2', '5.x'], hotkeys: [],
    tldr: 'Reduces the polygon count of a mesh while keeping its overall shape — essential for game-ready assets and performance.',
    gotchas: ['seed-gotcha-apply-scale'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/generate/decimate.html',
  },
  {
    _id: 'seed-page-edge-split', title: 'Edge Split', slug: 'edge-split', cat: 'seed-cat-generate',
    versions: ['4.2', '5.x'], hotkeys: [],
    tldr: 'Creates sharp creases on a smooth-shaded mesh by splitting edges — without adding any extra geometry.',
    gotchas: ['seed-gotcha-check-normals'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/generate/edge_split.html',
  },
  {
    _id: 'seed-page-mask', title: 'Mask', slug: 'mask', cat: 'seed-cat-generate',
    versions: ['4.2', '5.x'], hotkeys: [],
    tldr: 'Hides parts of your mesh using a vertex group — lets you show or hide geometry non-destructively without deleting anything.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/generate/mask.html',
  },
  {
    _id: 'seed-page-mirror', title: 'Mirror', slug: 'mirror', cat: 'seed-cat-generate',
    versions: ['4.2', '5.x'], hotkeys: [],
    tldr: 'Mirrors your mesh across an axis — model one half of a face, car, or weapon and get the other half automatically.',
    gotchas: ['seed-gotcha-origin-point', 'seed-gotcha-apply-scale'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/generate/mirror.html',
  },
  {
    _id: 'seed-page-multiresolution', title: 'Multiresolution', slug: 'multiresolution', cat: 'seed-cat-generate',
    versions: ['4.2', '5.x'], hotkeys: [],
    tldr: 'Adds multiple sculpting detail levels to a mesh — sculpt fine wrinkles without permanently subdividing your base mesh.',
    gotchas: ['seed-gotcha-apply-before-sculpt'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/generate/multiresolution.html',
  },
  {
    _id: 'seed-page-remesh', title: 'Remesh', slug: 'remesh', cat: 'seed-cat-generate',
    versions: ['4.2', '5.x'], hotkeys: [],
    tldr: 'Rebuilds your mesh topology with a clean, uniform grid — great for fixing messy sculpts before retopology.',
    gotchas: ['seed-gotcha-apply-scale'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/generate/remesh.html',
  },
  {
    _id: 'seed-page-screw', title: 'Screw', slug: 'screw', cat: 'seed-cat-generate',
    versions: ['4.2', '5.x'], hotkeys: [],
    tldr: 'Spins a profile curve around an axis to create lathe-turned shapes — bottles, cups, vases, columns, and wheel rims.',
    gotchas: ['seed-gotcha-origin-point'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/generate/screw.html',
  },
  {
    _id: 'seed-page-skin', title: 'Skin', slug: 'skin', cat: 'seed-cat-generate',
    versions: ['4.2', '5.x'], hotkeys: ['Ctrl', 'A'],
    tldr: 'Grows a mesh skin around a stick-figure of edges — the fastest way to prototype trees, creatures, and organic shapes.',
    gotchas: ['seed-gotcha-apply-scale'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/generate/skin.html',
  },
  {
    _id: 'seed-page-solidify', title: 'Solidify', slug: 'solidify', cat: 'seed-cat-generate',
    versions: ['4.2', '5.x'], hotkeys: [],
    tldr: 'Adds thickness to a flat surface — use it on paper, cloth, walls, leaves, and any thin object that needs depth.',
    gotchas: ['seed-gotcha-check-normals', 'seed-gotcha-apply-scale'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/generate/solidify.html',
  },
  {
    _id: 'seed-page-subdivision-surface', title: 'Subdivision Surface', slug: 'subdivision-surface', cat: 'seed-cat-generate',
    versions: ['4.2', '5.x'], hotkeys: ['Ctrl', '1'],
    tldr: 'Smooths your mesh by subdividing it — the standard way to turn blocky low-poly models into organic smooth shapes.',
    gotchas: ['seed-gotcha-apply-scale', 'seed-gotcha-apply-before-sculpt'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/generate/subdivision_surface.html',
  },
  {
    _id: 'seed-page-triangulate', title: 'Triangulate', slug: 'triangulate', cat: 'seed-cat-generate',
    versions: ['4.2', '5.x'], hotkeys: [],
    tldr: 'Converts all faces to triangles — required by game engines and many export formats like FBX and glTF.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/generate/triangulate.html',
  },
  {
    _id: 'seed-page-weld', title: 'Weld', slug: 'weld', cat: 'seed-cat-generate',
    versions: ['4.2', '5.x'], hotkeys: [],
    tldr: 'Merges vertices that are close together — fixes gaps, seams, and duplicate points left over from modeling.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/generate/weld.html',
  },
  {
    _id: 'seed-page-wireframe', title: 'Wireframe', slug: 'wireframe', cat: 'seed-cat-generate',
    versions: ['4.2', '5.x'], hotkeys: [],
    tldr: 'Replaces your mesh with a 3D version of its wireframe — creates cage, lattice, and technical illustration effects.',
    gotchas: ['seed-gotcha-apply-scale'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/generate/wireframe.html',
  },

  // ── Deform ────────────────────────────────────────────────────────────────
  {
    _id: 'seed-page-armature', title: 'Armature', slug: 'armature', cat: 'seed-cat-deform',
    versions: ['4.2', '5.x'], hotkeys: ['Ctrl', 'P'],
    tldr: 'Deforms a mesh using a skeleton of bones — the foundation of all character and creature animation in Blender.',
    gotchas: ['seed-gotcha-apply-scale'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/deform/armature.html',
  },
  {
    _id: 'seed-page-cast', title: 'Cast', slug: 'cast', cat: 'seed-cat-deform',
    versions: ['4.2', '5.x'], hotkeys: [],
    tldr: 'Morphs your mesh toward a sphere, cylinder, or cube shape — great for squash-and-stretch cartoon animation.',
    gotchas: ['seed-gotcha-apply-scale'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/deform/cast.html',
  },
  {
    _id: 'seed-page-curve', title: 'Curve', slug: 'curve', cat: 'seed-cat-deform',
    versions: ['4.2', '5.x'], hotkeys: [],
    tldr: 'Bends your mesh to follow a curve path — use it to create roads, rivers, pipes, conveyor belts, and tentacles.',
    gotchas: ['seed-gotcha-origin-point', 'seed-gotcha-apply-scale'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/deform/curve.html',
  },
  {
    _id: 'seed-page-displace', title: 'Displace', slug: 'displace', cat: 'seed-cat-deform',
    versions: ['4.2', '5.x'], hotkeys: [],
    tldr: 'Pushes vertices up and down using a texture as a height map — adds surface detail like rocks and terrain without sculpting.',
    gotchas: ['seed-gotcha-apply-scale'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/deform/displace.html',
  },
  {
    _id: 'seed-page-hook', title: 'Hook', slug: 'hook', cat: 'seed-cat-deform',
    versions: ['4.2', '5.x'], hotkeys: ['Ctrl', 'H'],
    tldr: 'Lets you grab a group of vertices and control them with an empty or bone — useful for facial shape controls and rigs.',
    gotchas: ['seed-gotcha-origin-point'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/deform/hooks.html',
  },
  {
    _id: 'seed-page-lattice', title: 'Lattice', slug: 'lattice', cat: 'seed-cat-deform',
    versions: ['4.2', '5.x'], hotkeys: [],
    tldr: 'Deforms your mesh using a cage of control points — reshape anything non-destructively without touching the actual vertices.',
    gotchas: ['seed-gotcha-apply-scale'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/deform/lattice.html',
  },
  {
    _id: 'seed-page-shrinkwrap', title: 'Shrinkwrap', slug: 'shrinkwrap', cat: 'seed-cat-deform',
    versions: ['4.2', '5.x'], hotkeys: [],
    tldr: 'Snaps your mesh to the surface of another object — the go-to tool for decals, fitted clothing, and retopology.',
    gotchas: ['seed-gotcha-check-normals'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/deform/shrinkwrap.html',
  },
  {
    _id: 'seed-page-simple-deform', title: 'Simple Deform', slug: 'simple-deform', cat: 'seed-cat-deform',
    versions: ['4.2', '5.x'], hotkeys: [],
    tldr: 'Bends, twists, tapers, or stretches your mesh along an axis — fast cartoon deformations with a single slider.',
    gotchas: ['seed-gotcha-apply-scale', 'seed-gotcha-origin-point'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/deform/simple_deform.html',
  },
  {
    _id: 'seed-page-smooth', title: 'Smooth', slug: 'smooth', cat: 'seed-cat-deform',
    versions: ['4.2', '5.x'], hotkeys: [],
    tldr: 'Softens the shape of a mesh by averaging vertex positions — removes bumps from noisy or jagged geometry.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/deform/smooth.html',
  },
  {
    _id: 'seed-page-wave', title: 'Wave', slug: 'wave', cat: 'seed-cat-deform',
    versions: ['4.2', '5.x'], hotkeys: [],
    tldr: 'Animates a ripple wave propagating across your mesh — water surfaces, flags waving, and cloth-like motion.',
    gotchas: ['seed-gotcha-apply-scale'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/deform/wave.html',
  },

  // ── Physics ───────────────────────────────────────────────────────────────
  {
    _id: 'seed-page-cloth', title: 'Cloth', slug: 'cloth', cat: 'seed-cat-physics',
    versions: ['4.2', '5.x'], hotkeys: [],
    tldr: 'Simulates fabric that drapes, folds, blows in wind, and collides with other objects — for curtains, capes, and clothing.',
    gotchas: ['seed-gotcha-apply-scale'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/physics/cloth/index.html',
  },
  {
    _id: 'seed-page-collision', title: 'Collision', slug: 'collision', cat: 'seed-cat-physics',
    versions: ['4.2', '5.x'], hotkeys: [],
    tldr: 'Marks an object as a solid barrier that cloth, particles, and fluid simulations bounce and collide against.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/physics/collision.html',
  },
  {
    _id: 'seed-page-fluid', title: 'Fluid Simulation', slug: 'fluid-simulation', cat: 'seed-cat-physics',
    versions: ['4.2', '5.x'], hotkeys: [],
    tldr: 'Simulates liquid or gas flowing, splashing, and spreading — use it for water, smoke, fire, and explosions.',
    gotchas: ['seed-gotcha-apply-scale'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/physics/fluid/index.html',
  },
  {
    _id: 'seed-page-ocean', title: 'Ocean', slug: 'ocean', cat: 'seed-cat-physics',
    versions: ['4.2', '5.x'], hotkeys: [],
    tldr: 'Generates an animated ocean surface with realistic waves, foam, and spray — no keyframing needed.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/modeling/modifiers/physics/ocean.html',
  },
  {
    _id: 'seed-page-soft-body', title: 'Soft Body', slug: 'soft-body', cat: 'seed-cat-physics',
    versions: ['4.2', '5.x'], hotkeys: [],
    tldr: 'Makes a mesh wobble, bounce, and squish like rubber or jelly when it moves or collides with objects.',
    gotchas: ['seed-gotcha-apply-scale'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/physics/soft_body/index.html',
  },
  {
    _id: 'seed-page-particle-system', title: 'Particle System', slug: 'particle-system', cat: 'seed-cat-physics',
    versions: ['4.2', '5.x'], hotkeys: [],
    tldr: 'Emits thousands of objects or hair strands from a mesh surface — sparks, smoke, rain, fur, and grass.',
    gotchas: ['seed-gotcha-apply-scale'],
    docsUrl: 'https://docs.blender.org/manual/en/latest/physics/particles/index.html',
  },

  // ── Shader Nodes ─────────────────────────────────────────────────────────
  {
    _id: 'seed-page-principled-bsdf', title: 'Principled BSDF', slug: 'principled-bsdf', cat: 'seed-cat-shader',
    versions: ['4.2', '5.x'], hotkeys: ['Shift', 'A'],
    tldr: 'The master material node. Controls how shiny, metallic, rough, or transparent a surface looks — start every material here.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/render/shader_nodes/shader/principled.html',
  },
  {
    _id: 'seed-page-emission', title: 'Emission', slug: 'emission', cat: 'seed-cat-shader',
    versions: ['4.2', '5.x'], hotkeys: ['Shift', 'A'],
    tldr: 'Makes a surface glow and emit light into the scene — use it for screens, lava, neon signs, and light panels.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/render/shader_nodes/shader/emission.html',
  },
  {
    _id: 'seed-page-mix-shader', title: 'Mix Shader', slug: 'mix-shader', cat: 'seed-cat-shader',
    versions: ['4.2', '5.x'], hotkeys: ['Shift', 'A'],
    tldr: 'Blends two shaders together using a factor or mask — mix glossy with diffuse, or glass with opaque for complex surfaces.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/render/shader_nodes/shader/mix.html',
  },
  {
    _id: 'seed-page-image-texture', title: 'Image Texture', slug: 'image-texture', cat: 'seed-cat-shader',
    versions: ['4.2', '5.x'], hotkeys: ['Shift', 'A'],
    tldr: 'Projects a photo or painted image onto your mesh surface — the main way to apply real-world textures in Blender.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/render/shader_nodes/textures/image.html',
  },
  {
    _id: 'seed-page-noise-texture', title: 'Noise Texture', slug: 'noise-texture', cat: 'seed-cat-shader',
    versions: ['4.2', '5.x'], hotkeys: ['Shift', 'A'],
    tldr: 'Generates a random cloudy pattern — break up uniform surfaces, drive displacement, or create procedural dirt and wear.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/render/shader_nodes/textures/noise.html',
  },
  {
    _id: 'seed-page-color-ramp', title: 'Color Ramp', slug: 'color-ramp', cat: 'seed-cat-shader',
    versions: ['4.2', '5.x'], hotkeys: ['Shift', 'A'],
    tldr: 'Converts a grayscale value into a custom gradient — essential for controlling contrast and adding color to any texture.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/render/shader_nodes/converter/color_ramp.html',
  },
  {
    _id: 'seed-page-bump', title: 'Bump', slug: 'bump', cat: 'seed-cat-shader',
    versions: ['4.2', '5.x'], hotkeys: ['Shift', 'A'],
    tldr: 'Fakes small surface bumps using a grayscale texture — cheaper than real geometry displacement, great for pores and scratches.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/render/shader_nodes/vector/bump.html',
  },
  {
    _id: 'seed-page-normal-map', title: 'Normal Map', slug: 'normal-map', cat: 'seed-cat-shader',
    versions: ['4.2', '5.x'], hotkeys: ['Shift', 'A'],
    tldr: 'Fakes surface detail by bending how light hits each pixel — the standard way to bake detail from high-poly to game-ready mesh.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/render/shader_nodes/vector/normal_map.html',
  },
  {
    _id: 'seed-page-fresnel', title: 'Fresnel', slug: 'fresnel', cat: 'seed-cat-shader',
    versions: ['4.2', '5.x'], hotkeys: ['Shift', 'A'],
    tldr: 'Outputs how much a surface reflects based on viewing angle — edges reflect more than flat-on surfaces, like real glass and plastic.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/render/shader_nodes/input/fresnel.html',
  },
  {
    _id: 'seed-page-ambient-occlusion', title: 'Ambient Occlusion', slug: 'ambient-occlusion', cat: 'seed-cat-shader',
    versions: ['4.2', '5.x'], hotkeys: ['Shift', 'A'],
    tldr: 'Darkens crevices, corners, and tight areas to fake contact shadows — adds depth and realism without extra lights.',
    gotchas: [],
    docsUrl: 'https://docs.blender.org/manual/en/latest/render/shader_nodes/input/ao.html',
  },
]

// ── Run ───────────────────────────────────────────────────────────────────────

async function run() {
  console.log('🌱 Starting seed...\n')

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
      versionTags: p.versions,
      tldr: p.tldr,
      hotkeys: p.hotkeys,
      docsUrl: p.docsUrl,
      trackerFlags: flags,
      linkedGotchas: p.gotchas.map(id => ({ _type: 'reference', _ref: id, _key: uid() })),
    }
    await client.createOrReplace(doc)
    console.log(`  ✓ ${p.title}`)
  }

  const total = CATEGORIES.length + GOTCHAS.length + PAGES.length
  console.log(`\n✅ Done! Created ${total} documents.`)
  console.log(`   ${CATEGORIES.length} categories · ${GOTCHAS.length} gotchas · ${PAGES.length} pages`)
}

run().catch(err => { console.error('❌ Seed failed:', err.message); process.exit(1) })
