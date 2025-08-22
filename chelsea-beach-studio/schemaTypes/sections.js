export default {
  name: 'section',
  title: 'Page Section',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Section Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'sectionType',
      title: 'Section Type',
      type: 'string',
      options: {
        list: [
          { title: 'Hero', value: 'hero' },
          { title: 'Headline', value: 'headline' },
          { title: 'Image', value: 'image' },
          { title: 'Basic Page', value: 'basicPage' },
          { title: 'Contact', value: 'contact' },
          { title: 'Home Scroll', value: 'homeScroll' },
          { title: 'Two Columns', value: 'sectionTwoColumn' },
          { title: 'Nested Section', value: 'nested' },
          { title: 'Banner Section', value: 'banner' },
          { title: 'News', value: 'news' },
          { title: 'Selected News', value: 'selectedNews' },
          { title: 'Services', value: 'services' },
          { title: 'Selected Services', value: 'selectedServices' },
          { title: 'Quote', value: 'quote' },
          { title: 'Google Map', value: 'googleMap' },
          { title: 'Gallery', value: 'gallery' },
          { title: 'Text', value: 'text' }
        ]
      },
      validation: Rule => Rule.required()
    },
    // Hero Section Fields
    {
      name: 'heroContent',
      title: 'Hero Content',
      type: 'object',
      hidden: ({ parent }) => parent?.sectionType !== 'hero',
      fields: [
        {
          name: 'image',
          title: 'Hero Image',
          type: 'image',
          options: { hotspot: true }
        },
        {
          name: 'headerPadding',
          title: 'Add Header Padding',
          type: 'boolean',
          description: 'Adds padding to account for the fixed header',
          initialValue: false
        }
      ]
    },
    // Headline Section Fields
    {
      name: 'headlineContent',
      title: 'Headline Content',
      type: 'object',
      hidden: ({ parent }) => parent?.sectionType !== 'headline',
      fields: [
        {
          name: 'headline',
          title: 'Headline',
          type: 'array',
          of: [{ type: 'block' }],
          description: 'Main headline content with rich text formatting.'
        },
        {
          name: 'button',
          title: 'Button',
          type: 'object',
          fields: [
            { name: 'text', title: 'Button Text', type: 'string' },
            { name: 'url', title: 'Button URL', type: 'url' }
          ]
        },
        {
          name: 'centerText',
          title: 'Center Text',
          type: 'boolean',
          description: 'Apply the text-center class'
        },
        {
          name: 'centerBlock',
          title: 'Center Block',
          type: 'boolean',
          description: 'Apply the grid-center-items class'
        },
        {
          name: 'paddingBottom',
          title: 'Padding Bottom',
          type: 'string',
          options: {
            list: [
              { title: '0', value: '0' },
              { title: '1', value: '1' },
              { title: '2', value: '2' },
              { title: '3', value: '3' },
              { title: '4', value: '4' },
              { title: '5', value: '5' }
            ]
          },
          initialValue: '0',
          description: 'Select the amount of padding bottom for this section'
        },
        {
          name: 'showArrow',
          title: 'Show Arrow',
          type: 'boolean',
          initialValue: false,
          description: 'Show a scroll arrow that navigates to the next section when clicked'
        }
      ]
    },
    // Image Section Fields
    {
      name: 'imageContent',
      title: 'Image Content',
      type: 'object',
      hidden: ({ parent }) => parent?.sectionType !== 'image',
      fields: [
        {
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { hotspot: true }
        },
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          initialValue: 'Chelsea Beach'
        },
        {
          name: 'constrainHeight',
          title: 'Constrain Height to 100svh',
          type: 'boolean',
          initialValue: false
        },
        {
          name: 'alignment',
          title: 'Image Alignment',
          type: 'string',
          options: {
            list: [
              { title: 'Left', value: 'left' },
              { title: 'Center', value: 'center' },
              { title: 'Right', value: 'right' }
            ]
          },
          initialValue: 'center'
        },
        {
          name: 'columns',
          title: 'Number of Columns (out of 12)',
          type: 'number',
          initialValue: 12,
          validation: Rule => Rule.max(12),
        }
      ]
    },
    // Basic Page Section Fields
    {
      name: 'basicContent',
      title: 'Basic Content',
      type: 'object',
      hidden: ({ parent }) => parent?.sectionType !== 'basicPage',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string'
        },
        {
          name: 'content',
          title: 'Content',
          type: 'array',
          of: [{ type: 'block' }]
        },
        {
          name: 'pdf',
          title: 'PDF Document',
          type: 'file',
          options: {
            accept: '.pdf'
          },
          description: 'Upload a PDF document to be displayed with this content'
        }
      ]
    },
    // Contact Section Fields
    {
      name: 'contactContent',
      title: 'Contact Content',
      type: 'object',
      hidden: ({ parent }) => parent?.sectionType !== 'contact',
      fields: [
        {
          name: 'content',
          title: 'Contact Content',
          type: 'text',
          rows: 10,
          description: 'Contact information. Use line breaks (Enter) for new lines.'
        },
        {
          name: 'ftCreditLogo',
          title: 'FT Credit Logo',
          type: 'image',
          options: { hotspot: true },
          description: 'Logo for FT credit section'
        },
        {
          name: 'decorativeImage',
          title: 'Decorative Image',
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string'
            }
          ],
          description: 'Decorative image to display in the contact section'
        }
      ]
    },
    // Home Scroll Section Fields
    {
      name: 'homeScrollContent',
      title: 'Home Scroll Content',
      type: 'object',
      hidden: ({ parent }) => parent?.sectionType !== 'homeScroll',
      fields: [
        {
          name: 'items',
          title: 'Media Items',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Title',
                  type: 'string',
                  validation: Rule => Rule.required()
                },
                {
                  name: 'image',
                  title: 'Image',
                  type: 'image',
                  options: {
                    hotspot: true
                  }
                },
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
              ],
              preview: {
                select: {
                  title: 'title',
                  media: 'image'
                }
              }
            }
          ],
          validation: Rule => Rule.min(1).max(8)
        }
      ]
    },
    // Two Column Section Fields
    {
      name: 'twoColumnContent',
      title: 'Two Column Content',
      type: 'object',
      hidden: ({ parent }) => parent?.sectionType !== 'sectionTwoColumn',
      fields: [
        {
          name: 'mainImage',
          title: 'Main Image',
          type: 'image',
          options: { hotspot: true }
        },
        {
          name: 'text',
          title: 'Text Box',
          type: 'array',
          of: [{ type: 'block' }]
        },
        {
          name: 'imageRight',
          title: 'Image right',
          type: 'boolean',
          initialValue: false,
          description: 'If true, image will be on the right (grid-reverse).'
        }
      ]
    },
    // Nested Section Fields
    {
      name: 'nestedContent',
      title: 'Nested Content',
      type: 'object',
      hidden: ({ parent }) => parent?.sectionType !== 'nested',
      fields: [
        {
          name: 'mainImage',
          title: 'Main Image',
          type: 'image',
          options: { hotspot: true }
        },
        {
          name: 'iconImage',
          title: 'Icon Image',
          type: 'image',
          options: { hotspot: true },
          description: 'Optional icon image to display above the text'
        },
        {
          name: 'content',
          title: 'Content',
          type: 'text',
          rows: 4,
          description: 'Main text content for the section'
        }
      ]
    },
    // Banner Section Fields
    {
      name: 'bannerContent',
      title: 'Banner Content',
      type: 'object',
      hidden: ({ parent }) => parent?.sectionType !== 'banner',
      fields: [
        {
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { hotspot: true }
        },
        {
          name: 'content',
          title: 'Content',
          type: 'text',
          rows: 4
        }
      ]
    },
    // News Section Fields
    {
      name: 'newsContent',
      title: 'News Content',
      type: 'object',
      hidden: ({ parent }) => parent?.sectionType !== 'news',
      fields: [
        {
          name: 'topText',
          title: 'Top Text',
          type: 'text',
          rows: 3,
          description: 'Optional text to display at the top of the news section'
        }
      ]
    },
    // Selected Services Section Fields
    {
      name: 'selectedServicesContent',
      title: 'Selected Services Content',
      type: 'object',
      hidden: ({ parent }) => parent?.sectionType !== 'selectedServices',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          description: 'Title displayed above the services'
        },
        {
          name: 'services',
          title: 'Services',
          type: 'array',
          of: [
            {
              type: 'reference',
              to: [{ type: 'service' }],
            },
          ],
          options: { sortable: true },
        },
        {
          name: 'button',
          title: 'Button',
          type: 'object',
          fields: [
            { name: 'text', title: 'Button Text', type: 'string' },
            { name: 'page', title: 'Page Link', type: 'reference', to: [{ type: 'page' }] },
            { name: 'url', title: 'External URL', type: 'url' },
          ],
          description: 'Add either a page link or an external URL. If both are set, Page Link takes priority.'
        },
      ],
    },
    {
      name: 'selectedNewsContent',
      title: 'Selected News Content',
      type: 'object',
      hidden: ({ parent }) => parent?.sectionType !== 'selectedNews',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string', initialValue: 'News' },
        {
          name: 'news',
          title: 'Selected News',
          type: 'array',
          of: [
            { type: 'reference', to: [{ type: 'news' }] },
          ],
          options: { sortable: true },
          description: 'Select news items to display. If none are selected, the latest 2 will be shown.'
        },
        {
          name: 'button',
          title: 'Button',
          type: 'object',
          fields: [
            { name: 'text', title: 'Button Text', type: 'string', validation: Rule => Rule.required() },
            { name: 'page', title: 'Page Link', type: 'reference', to: [{ type: 'page' }] },
            { name: 'url', title: 'External URL', type: 'url' },
          ],
          description: 'Add either a page link or an external URL. If both are set, Page Link takes priority.'
        },
      ],
    },
    // Quote Section Fields
    {
      name: 'quoteContent',
      title: 'Quote Content',
      type: 'object',
      hidden: ({ parent }) => parent?.sectionType !== 'quote',
      fields: [
        {
          name: 'quote',
          title: 'Quote',
          type: 'text',
          rows: 4,
          description: 'The main quote text'
        },
        {
          name: 'cite',
          title: 'Citation',
          type: 'string',
          description: 'Who said the quote (e.g., "John Smith, CEO")'
        },
        {
          name: 'alignment',
          title: 'Alignment',
          type: 'string',
          options: {
            list: [
              { title: 'Left', value: 'left' },
              { title: 'Center', value: 'center' },
              { title: 'Right', value: 'right' }
            ]
          },
          initialValue: 'left',
          description: 'Choose the alignment for the quote'
        }
      ]
    },
    // Google Map Section Fields
    {
      name: 'googleMapContent',
      title: 'Google Map Content',
      type: 'object',
      hidden: ({ parent }) => parent?.sectionType !== 'googleMap',
      fields: [
        {
          name: 'latitude',
          title: 'Latitude',
          type: 'number',
          description: 'Map latitude coordinate (e.g., 50.8225)'
        },
        {
          name: 'longitude',
          title: 'Longitude',
          type: 'number',
          description: 'Map longitude coordinate (e.g., -0.1372)'
        },
        {
          name: 'zoom',
          title: 'Zoom Level',
          type: 'number',
          options: {
            list: [
              { title: 'World', value: 1 },
              { title: 'Continent', value: 3 },
              { title: 'Country', value: 5 },
              { title: 'Region', value: 7 },
              { title: 'City', value: 10 },
              { title: 'District', value: 13 },
              { title: 'Street', value: 16 },
              { title: 'Building', value: 19 }
            ]
          },
          initialValue: 15,
          description: 'Map zoom level (1-20)'
        },
        {
          name: 'mapHeight',
          title: 'Map Height',
          type: 'string',
          options: {
            list: [
              { title: 'Small (300px)', value: '300px' },
              { title: 'Medium (400px)', value: '400px' },
              { title: 'Large (500px)', value: '500px' },
              { title: 'Extra Large (600px)', value: '600px' }
            ]
          },
          initialValue: '400px',
          description: 'Height of the map container'
        },
        {
          name: 'googleMapsLink',
          title: 'Google Maps Listing Link',
          type: 'url',
          description: 'Link to the full Google Maps listing (e.g., https://maps.google.com/...)'
        }
      ]
    },
    // Gallery Section Fields
    {
      name: 'galleryContent',
      title: 'Gallery Content',
      type: 'object',
      hidden: ({ parent }) => parent?.sectionType !== 'gallery',
      fields: [
        {
          name: 'items',
          title: 'Gallery Items',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'image',
                  title: 'Image',
                  type: 'image',
                  options: { hotspot: true },
                  description: 'Optional image. Leave empty to create a spacer.'
                },
                {
                  name: 'columns',
                  title: 'Columns',
                  type: 'number',
                  options: {
                    list: [
                      { title: '1 Column', value: 1 },
                      { title: '2 Columns', value: 2 },
                      { title: '3 Columns', value: 3 },
                      { title: '4 Columns', value: 4 },
                      { title: '5 Columns', value: 5 },
                      { title: '6 Columns', value: 6 },
                      { title: '7 Columns', value: 7 },
                      { title: '8 Columns', value: 8 },
                      { title: '9 Columns', value: 9 },
                      { title: '10 Columns', value: 10 },
                      { title: '11 Columns', value: 11 },
                      { title: '12 Columns', value: 12 }
                    ]
                  },
                  initialValue: 6,
                  validation: Rule => Rule.required(),
                  description: 'Number of columns this item should span (1-12)'
                },
                {
                  name: 'imageRatio',
                  title: 'Image Ratio',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Square (1:1)', value: 'square' },
                      { title: 'Landscape (16:9)', value: 'landscape' },
                      { title: 'Portrait (3:4)', value: 'portrait' },
                      { title: 'Wide (21:9)', value: 'wide' },
                      { title: 'Tall (2:3)', value: 'tall' },
                      { title: 'Custom Height', value: 'custom' }
                    ]
                  },
                  initialValue: 'square',
                  description: 'Aspect ratio for the image'
                },
                {
                  name: 'customHeight',
                  title: 'Custom Height',
                  type: 'string',
                  hidden: ({ parent }) => parent?.imageRatio !== 'custom',
                  description: 'Custom height (e.g., 300px, 50vh)',
                  placeholder: '300px'
                }
              ],
              preview: {
                select: {
                  media: 'image',
                  columns: 'columns',
                  ratio: 'imageRatio'
                },
                prepare({ media, columns, ratio }) {
                  return {
                    title: media ? 'Image Item' : 'Spacer',
                    subtitle: `${columns} columns, ${ratio} ratio`
                  }
                }
              }
            }
          ],
          validation: Rule => Rule.min(1),
          description: 'Add gallery items. Each item can span 1-12 columns and have different aspect ratios.'
        }
      ]
    },
    // Text Section Fields
    {
      name: 'textContent',
      title: 'Text Content',
      type: 'object',
      hidden: ({ parent }) => parent?.sectionType !== 'text',
      fields: [
        {
          name: 'content',
          title: 'Text Content',
          type: 'array',
          of: [{ type: 'block' }],
          description: 'Rich text content for the section.'
        },
        {
          name: 'columns',
          title: 'Number of Columns',
          type: 'number',
          options: {
            list: [
              { title: '1 Column', value: 1 },
              { title: '2 Columns', value: 2 },
              { title: '3 Columns', value: 3 },
              { title: '4 Columns', value: 4 },
              { title: '5 Columns', value: 5 },
              { title: '6 Columns', value: 6 },
              { title: '7 Columns', value: 7 },
              { title: '8 Columns', value: 8 },
              { title: '9 Columns', value: 9 },
              { title: '10 Columns', value: 10 },
              { title: '11 Columns', value: 11 },
              { title: '12 Columns', value: 12 }
            ]
          },
          initialValue: 6,
          validation: Rule => Rule.required(),
          description: 'Number of columns the text content should span (1-12)'
        },
        {
          name: 'offset',
          title: 'Column Offset',
          type: 'number',
          options: {
            list: [
              { title: 'No Offset', value: 0 },
              { title: '1 Column', value: 1 },
              { title: '2 Columns', value: 2 },
              { title: '3 Columns', value: 3 },
              { title: '4 Columns', value: 4 },
              { title: '5 Columns', value: 5 },
              { title: '6 Columns', value: 6 },
              { title: '7 Columns', value: 7 },
              { title: '8 Columns', value: 8 },
              { title: '9 Columns', value: 9 },
              { title: '10 Columns', value: 10 },
              { title: '11 Columns', value: 11 }
            ]
          },
          initialValue: 0,
          description: 'Number of columns to offset the text content (0-11)'
        }
      ]
    },
  ],
  preview: {
    select: {
      title: 'title',
      type: 'sectionType'
    },
    prepare({ title, type }) {
      return {
        title: title,
        subtitle: `Section Type: ${type}`
      }
    }
  }
} 