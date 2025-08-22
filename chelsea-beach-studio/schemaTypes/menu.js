export default {
  name: 'menu',
  title: 'Menu',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Menu Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'items',
      title: 'Menu Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'text', title: 'Text', type: 'string', validation: Rule => Rule.required() },
            {
              name: 'to',
              title: 'Link',
              type: 'object',
              fields: [
                {
                  name: 'page',
                  title: 'Page Reference',
                  type: 'reference',
                  to: [{ type: 'page' }]
                },
                {
                  name: 'url',
                  title: 'Custom URL',
                  type: 'string',
                  description: 'Use for external or custom links. If both are set, Page Reference takes priority.'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
} 