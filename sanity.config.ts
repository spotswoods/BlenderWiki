import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemas } from './sanity/schemas'

export default defineConfig({
  name: 'blenderpage',
  title: 'Blender Wiki CMS',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem().title('📚 Reference Pages').schemaType('referencePage').child(
              S.list().title('Reference Pages').items([
                S.listItem().title('🔴 Needs Hero Video').child(
                  S.documentList().title('Needs Hero').filter('_type == "referencePage" && trackerFlags.needsHero == true')
                ),
                S.listItem().title('🟡 Needs UI Screenshot').child(
                  S.documentList().title('Needs UI').filter('_type == "referencePage" && trackerFlags.needsUI == true')
                ),
                S.listItem().title('🔵 Needs .blend File').child(
                  S.documentList().title('Needs Examples').filter('_type == "referencePage" && trackerFlags.needsExamples == true')
                ),
                S.listItem().title('✅ All Pages').child(
                  S.documentList().title('All Pages').filter('_type == "referencePage"')
                ),
              ])
            ),
            S.listItem().title('⚠️ Gotchas').schemaType('gotcha').child(S.documentTypeList('gotcha')),
            S.listItem().title('🗂️ Categories').schemaType('category').child(S.documentTypeList('category')),
          ])
    }),
    visionTool(),
  ],
  schema: { types: schemas },
})
