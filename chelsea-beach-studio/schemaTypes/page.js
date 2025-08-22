export default {
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'routeName',
      title: 'Route Name (Legacy)',
      type: 'string',
      description: 'Only use this for specific cases where slug cannot be used. This field is deprecated.',
      hidden: true
    },
    {
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'section' }]
        }
      ],
      validation: Rule => Rule.unique()
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string'
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text'
        },
        {
          name: 'ogImage',
          title: 'Open Graph Image',
          type: 'image'
        }
      ]
    },
    {
      name: 'darkMode',
      title: 'Dark Mode',
      type: 'boolean',
      description: 'Enable dark mode for this page',
      initialValue: false
    },
    {
      name: 'removeTopPadding',
      title: 'Remove top padding',
      type: 'boolean',
      description: 'Remove top padding from the page content',
      initialValue: false
    },
    {
      name: 'hideFooter',
      title: 'Hide Footer',
      type: 'boolean',
      description: 'Hide the footer on this page',
      initialValue: false
    },
    {
      name: 'hideHeaderLogo',
      title: 'Hide Header Logo',
      type: 'boolean',
      description: 'Hide the logo in the header on this page',
      initialValue: false
    },
    {
      name: 'greyBackground',
      title: 'Grey Background',
      type: 'boolean',
      description: 'Set page background to grey instead of white',
      initialValue: false
    }
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current'
    },
    prepare({ title, slug }) {
      return {
        title,
        subtitle: slug ? `/${slug}` : ''
      }
    }
  }
} 