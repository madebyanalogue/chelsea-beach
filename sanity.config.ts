import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'wwwrb2ji',
  dataset: 'production',
  apiVersion: '2024-03-19',
  useCdn: true,
  perspective: 'published'
}) 