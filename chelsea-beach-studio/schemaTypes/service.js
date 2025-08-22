import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export default {
  name: 'service',
  title: 'Service',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: 'service' }),
    { name: 'title', type: 'string', title: 'Title' },
    { name: 'image', type: 'image', title: 'Image', options: { hotspot: true } },
    { name: 'description', type: 'array', of: [{ type: 'block' }], title: 'Description' }
  ]
} 