{
  name: 'publishedAt',
  title: 'Publication Date',
  type: 'date',
  validation: (Rule: any) => Rule.required()
},
{
  name: 'featuredImage',
  title: 'Featured Image',
  type: 'image',
  options: {
    hotspot: true
  },
  fields: [
    {
      name: 'alt',
      type: 'string',
      title: 'Alternative Text'
    }
  ],
  validation: (Rule: any) => Rule.required()
} 