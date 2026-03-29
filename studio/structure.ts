import { StructureBuilder } from "sanity/structure";

/**
 * Custom studio structure:
 * - Separates the Tracker view (filtered lists by flags) from the main content lists
 */
export const structure = (S: StructureBuilder) =>
  S.list()
    .title("BlenderWiki")
    .items([
      // ── Main content ──────────────────────────────────────────
      S.listItem()
        .title("Reference Pages")
        .schemaType("referencePage")
        .child(S.documentTypeList("referencePage").title("All Pages")),

      S.listItem()
        .title("Gotchas")
        .schemaType("gotcha")
        .child(S.documentTypeList("gotcha").title("All Gotchas")),

      S.listItem()
        .title("Categories")
        .schemaType("category")
        .child(S.documentTypeList("category").title("All Categories")),

      S.divider(),

      // ── Tracker ───────────────────────────────────────────────
      S.listItem()
        .title("🔴 Needs Hero Video")
        .child(
          S.documentList()
            .title("Needs Hero Video")
            .schemaType("referencePage")
            .filter('_type == "referencePage" && trackerFlags.needsHero == true')
        ),

      S.listItem()
        .title("🟡 Needs UI Screenshot")
        .child(
          S.documentList()
            .title("Needs UI Screenshot")
            .schemaType("referencePage")
            .filter('_type == "referencePage" && trackerFlags.needsUI == true')
        ),

      S.listItem()
        .title("🔵 Needs .Blend File")
        .child(
          S.documentList()
            .title("Needs .Blend File")
            .schemaType("referencePage")
            .filter('_type == "referencePage" && trackerFlags.needsExamples == true')
        ),

      S.listItem()
        .title("✅ Complete")
        .child(
          S.documentList()
            .title("Complete Pages")
            .schemaType("referencePage")
            .filter(
              '_type == "referencePage" && trackerFlags.needsHero == false && trackerFlags.needsUI == false && trackerFlags.needsExamples == false'
            )
        ),
    ]);
