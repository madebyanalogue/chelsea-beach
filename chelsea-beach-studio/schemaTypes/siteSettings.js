export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Website Title',
      type: 'string',
      description: 'The main title of the website'
    },
    {
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
      description: 'Leave empty to hide the LinkedIn icon'
    },
    {
      name: 'footerLogos',
      title: 'Footer Logos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true }
        }
      ],
      description: 'Logos to display in the footer. Recommended: transparent PNG or SVG.'
    },
    {
      name: 'certificationLogo',
      title: 'Certification Logo',
      type: 'image',
      options: { hotspot: true },
      description: 'Logo for certification section in the footer.'
    },
    {
      name: 'ftCreditLogo',
      title: 'FT Credit Logo',
      type: 'image',
      options: { hotspot: true },
      description: 'Logo for FT credit section in the footer.'
    },
    {
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'value', title: 'Value', type: 'text' }
          ]
        }
      ],
      description: 'Contact details.'
    },
    {
      name: 'menuBackgroundImage',
      title: 'Menu Background Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Background image for the overlay menu. Recommended: high resolution image with good contrast.'
    },
    {
      name: 'preloaderImages',
      title: 'Preloader Images',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true
              },
              validation: Rule => Rule.required()
            },
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Alternative text for accessibility'
            }
          ],
          preview: {
            select: {
              media: 'image',
              title: 'alt'
            }
          }
        }
      ],
      description: 'Images to display in sequence during the preloader animation. The last image will be followed by the website title.'
    },
    {
      name: 'seo',
      title: 'Global SEO Settings',
      type: 'object',
      fields: [
        {
          name: 'defaultMetaDescription',
          title: 'Default Meta Description',
          type: 'text',
          description: 'Default meta description for pages that don\'t have one set. Keep under 160 characters.',
          validation: Rule => Rule.max(160)
        },
        {
          name: 'defaultOgImage',
          title: 'Default Open Graph Image',
          type: 'image',
          description: 'Default Facebook/Twitter share image (1200x630px recommended)',
          options: { hotspot: true }
        },
        {
          name: 'facebookAppId',
          title: 'Facebook App ID',
          type: 'string',
          description: 'Facebook App ID for social media integration'
        },
        {
          name: 'twitterHandle',
          title: 'Twitter Handle',
          type: 'string',
          description: 'Your Twitter handle (without @)'
        }
      ]
    },
    {
      name: 'favicon',
      title: 'Favicon & App Icons',
      type: 'object',
      fields: [
        {
          name: 'favicon',
          title: 'Favicon (ICO)',
          type: 'file',
          description: 'Main favicon file (.ico format, 16x16, 32x32, 48x48px)',
          options: {
            accept: '.ico'
          }
        },
        {
          name: 'faviconPng',
          title: 'Favicon (PNG)',
          type: 'image',
          description: 'PNG favicon for modern browsers (32x32px recommended)',
          options: { hotspot: false }
        },
        {
          name: 'appleTouchIcon',
          title: 'Apple Touch Icon',
          type: 'image',
          description: 'Icon for iOS devices (180x180px recommended)',
          options: { hotspot: false }
        },
        {
          name: 'androidIcon',
          title: 'Android Icon',
          type: 'image',
          description: 'Icon for Android devices (192x192px recommended)',
          options: { hotspot: false }
        }
      ]
    }
    // You can add more social links or images here in the future
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings'
      }
    }
  }
} 