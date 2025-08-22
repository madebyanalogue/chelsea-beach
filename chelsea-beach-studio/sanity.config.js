import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

export default defineConfig({
  name: 'default',
  title: 'Chelsea Beach',

  projectId: 'wwwrb2ji',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Settings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            orderableDocumentListDeskItem({type: 'service', title: 'Services', S, context}),
            S.documentTypeListItem('news').title('News'),
            S.documentTypeListItem('page').title('Page'),
            S.documentTypeListItem('section').title('Page Section'),
            S.documentTypeListItem('menu').title('Menu'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
