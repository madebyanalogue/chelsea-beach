import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'uuzbe0e0',
  dataset: 'production',
  apiVersion: '2024-03-19',
  useCdn: true,
  perspective: 'published'
}) 