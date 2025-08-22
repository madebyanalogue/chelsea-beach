import { createClient } from '@sanity/client'

// Define our own error type since SanityError isn't exported
interface SanityError extends Error {
  details?: any
  statusCode?: number
}

const client = createClient({
  projectId: 'xanklzya',
  dataset: 'production',
  apiVersion: '2024-03-19',
  useCdn: false
})

interface Section {
  _type: string
  sectionType: string
  [key: string]: any
}

interface Page {
  _id: string
  title: string
  slug: {
    current: string
  }
  sections?: Section[]
  darkMode?: boolean
  removeTopPadding?: boolean
  hideFooter?: boolean
  hideHeaderLogo?: boolean
  greyBackground?: boolean
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  
  try {
    if (query.type === 'siteSettings') {
      try {
        const result = await client.fetch(`
          *[_type == "siteSettings"] | order(_updatedAt desc)[0] {
            ...,
            // Expand assets for images used across the site
            footerLogos[] {
              ...,
              asset->
            },
            certificationLogo {
              ...,
              asset->
            },
            ftCreditLogo {
              ...,
              asset->
            },
            menuBackgroundImage {
              ...,
              asset->
            },
            // Preloader images (square images displayed before site load)
            preloaderImages[] {
              "image": select(
                _type == "image" => @,
                defined(image) => image,
                @
              ){
                ...,
                asset->
              },
              alt
            },
            // Contact info
            contactInfo[] {
              label,
              value
            }
          }
        `)
        if (!result) {
          return { footerLogos: [], contactInfo: [] }
        }
        return result
      } catch (fetchError: any) {
        console.error('Error fetching siteSettings:', {
          message: fetchError?.message,
          stack: fetchError?.stack,
          details: fetchError?.details,
          statusCode: fetchError?.statusCode
        })
        throw fetchError
      }
    }
    
    if (query.menuTitle) {
      const result = await client.fetch(
        '*[_type == "menu" && title == $menuTitle][0]{..., items[]{..., to{..., page-> { _id, slug, title }}}}',
        { menuTitle: query.menuTitle }
      )
      return result
    }
    
    if (query.type === 'page') {
      let result: Page | null
      
      if (query.identifierType === 'slug') {
        const queryString = `*[_type == "page" && slug.current == $identifier][0] {
          _id,
          title,
          slug,
          darkMode,
          removeTopPadding,
          hideFooter,
          hideHeaderLogo,
          greyBackground,
          sections[]-> {
            _id,
            _type,
            title,
            sectionType,
            heroContent {
              image {
                asset-> {
                  _id,
                  url,
                  metadata {
                    dimensions
                  }
                }
              }
            },

            basicContent {
              title,
              content,
              pdf {
                asset-> {
                  _id,
                  url,
                  metadata { dimensions }
                }
              }
            },
            imageContent {
              image {
                asset-> {
                  _id,
                  url,
                  metadata {
                    dimensions
                  }
                }
              },
              constrainHeight,
              alignment,
              columns,
              grid
            },
            headlineContent {
              headline,
              centerText,
              centerBlock,
              paddingBottom,
              showArrow,
              button {
                text,
                url
              }
            },

            contactContent {
              content,
              items[] {
                _key,
                label,
                value
              },
              ftCreditLogo {
                asset-> {
                  _id,
                  url
                }
              },
              decorativeImage {
                asset-> {
                  _id,
                  url,
                  metadata {
                    dimensions
                  }
                },
                alt
              }
            },
            homeScrollContent {
              items[] {
                _key,
                title,
                image {
                  asset-> {
                    _id,
                    url,
                    metadata {
                      dimensions
                    }
                  }
                },
                link {
                  page-> {
                    slug {
                      current
                    }
                  },
                  url
                }
              }
            },
            twoColumnContent {
              mainImage {
                asset-> {
                  _id,
                  url,
                  metadata { dimensions }
                }
              },
              roundalImage {
                asset-> {
                  _id,
                  url,
                  metadata { dimensions }
                }
              },
              includeLogo,
              logoImage {
                asset-> {
                  _id,
                  url,
                  metadata { dimensions }
                }
              },
              text,
              imageRight
            },
            nestedContent {
              mainImage {
                asset-> {
                  _id,
                  url,
                  metadata { dimensions }
                }
              },
              iconImage {
                asset-> {
                  _id,
                  url,
                  metadata { dimensions }
                }
              },
              content,
              backgroundColor,
              textColor
            },
            bannerContent {
              image {
                asset-> {
                  _id,
                  url,
                  metadata { dimensions }
                }
              },
              content
            },
            newsContent {
              topText
            },
            selectedNewsContent {
              title,
              news[]-> {
                _id,
                title,
                publishedAt,
                summary,
                content,
                featuredImage {
                  asset-> {
                    _id,
                    url,
                    metadata { dimensions }
                  }
                },
                pdf {
                  asset-> {
                    _id,
                    url,
                    metadata { dimensions }
                  }
                }
              },
              button {
                text,
                page-> { slug },
                url
              }
            },
            quoteContent {
              quote,
              cite,
              alignment
            },
            googleMapContent {
              latitude,
              longitude,
              zoom,
              mapHeight,
              googleMapsLink
            },
            galleryContent {
              items[] {
                image {
                  asset-> {
                    _id,
                    url,
                    metadata {
                      dimensions
                    }
                  }
                },
                columns,
                imageRatio,
                customHeight
              }
            },
            textContent {
              content,
              columns,
              offset
            },
            selectedServicesContent {
              title,
              services[]-> {
                _id,
                title,
                image {
                  asset-> {
                    _id,
                    url,
                    mimeType
                  }
                },
                description
              },
              button {
                text,
                page-> { slug },
                url
              }
            }
          }
        }`
        
        try {
          // Add detailed logging for the query parameters
          console.error('[Server API] Page query details:', {
            identifier: query.identifier,
            identifierType: query.identifierType,
            queryString,
            timestamp: new Date().toISOString()
          })

          result = await client.fetch<Page>(queryString, { identifier: query.identifier })
          
          // Log the result or lack thereof
          if (!result) {
            console.error('[Server API] No page found for slug:', query.identifier)
            throw createError({
              statusCode: 404,
              message: `Page not found: ${query.identifier}`
            })
          }



        } catch (error) {
          const fetchError = error as SanityError
          console.error('[Server API] Error fetching page:', {
            error: fetchError.message,
            stack: fetchError.stack,
            details: fetchError.details,
            statusCode: fetchError.statusCode,
            query: {
              identifier: query.identifier,
              type: query.type,
              identifierType: query.identifierType
            }
          })
          throw createError({
            statusCode: fetchError.statusCode || 500,
            message: `Error fetching page: ${fetchError.message}`
          })
        }
      } else {
        const queryString = '*[_type == "page" && routeName == $identifier][0]'
        try {
          result = await client.fetch<Page>(queryString, { identifier: query.identifier })
        } catch (error) {
          const fetchError = error as SanityError
          console.error('[Server API] Error fetching page by route name:', {
            error: fetchError.message,
            stack: fetchError.stack,
            details: fetchError.details,
            statusCode: fetchError.statusCode
          })
          throw fetchError
        }
      }

      if (!result) {
        throw createError({
          statusCode: 404,
          message: `Page not found: ${query.identifier}`
        })
      }
      return result
    }
    
    if (query.type === 'section') {
      const params: any = { sectionType: query.sectionType }
      if (query.title) {
        params.title = query.title
      }
      const result = await client.fetch(`
        *[_type == "section" && sectionType == $sectionType${query.title ? ' && title == $title' : ''}][0] {
          ...,
          heroContent {
            ...,
            heroElements[] {
              ...,
              image {
                ...,
                asset->
              }
            }
          },
          homeScrollContent {
            ...,
            items[] {
              ...,
              image {
                ...,
                asset->
              },
              link {
                ...,
                page-> {
                  _id,
                  title,
                  slug
                }
              }
            }
          },
          selectedServicesContent {
            services[]-> {
              _id,
              title,
              image {
                asset-> {
                  _id,
                  url,
                  mimeType
                }
              },
              description
            },
            button {
              text,
              page-> { slug },
              url
            }
          }
        }
      `, params)
      return result
    }
    
    if (query.type === 'sectionHomeScroll') {
      const result = await client.fetch('*[_type == "sectionHomeScroll"][0]{..., items[]{..., link{..., page-> { _id, slug, title }}}}')
      return result
    }
    
    if (query.type === 'news') {
      const limit = query.limit ? parseInt(query.limit as string) : undefined
      const limitClause = limit ? `[0...${limit}]` : ''
      
      const result = await client.fetch(`*[_type == "news"] | order(publishedAt desc)${limitClause} {
        _id,
        title,
        publishedAt,
        summary,
        content,
        featuredImage {
          asset-> {
            _id,
            url,
            metadata { dimensions }
          }
        },
        pdf {
          asset-> {
            _id,
            url,
            metadata { dimensions }
          }
        }
      }`)
      return result
    }

    if (query.type === 'service') {
      const result = await client.fetch(`*[_type == "service"] | order(orderRank){
        _id,
        title,
        image {
          asset-> {
            _id,
            url,
            mimeType
          }
        },
        description
      }`)
      return result
    }
    
    throw new Error('Invalid query parameters')
  } catch (error: any) {
    console.error('[Server API] Critical error:', {
      message: error?.message || 'Unknown error',
      stack: error?.stack,
      details: error?.details,
      statusCode: error?.statusCode,
      query,
      path: event.node.req.url
    })
    throw createError({
      statusCode: error?.statusCode || 500,
      message: `Error fetching data from Sanity: ${error?.message || 'Unknown error'}`
    })
  }
}) 