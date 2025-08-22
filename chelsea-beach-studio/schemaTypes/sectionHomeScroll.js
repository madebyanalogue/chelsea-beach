export default {
  name: 'sectionHomeScroll',
  title: 'Home Scroll Section',
  type: 'document',
  fields: [
    {
      name: 'items',
      title: 'Media Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required() },
            { name: 'image', title: 'Image', type: 'image', validation: Rule => Rule.required() },
            {
              name: 'link',
              title: 'Link',
              type: 'object',
              fields: [
                {
                  name: 'page',
                  title: 'Internal Page',
                  type: 'reference',
                  to: [{ type: 'page' }]
                },
                {
                  name: 'url',
                  title: 'External URL',
                  type: 'url'
                }
              ],
              validation: Rule =>
                Rule.custom(link =>
                  link && (link.page || link.url)
                    ? true
                    : 'You must provide either an internal page or an external URL'
                )
            }
          ]
        }
      ]
    }
  ]
} 