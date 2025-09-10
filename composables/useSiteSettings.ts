import { useAsyncData } from '#app'
import { computed } from 'vue'

export const useSiteSettings = () => {
  const { data: settings, error, pending } = useAsyncData('siteSettings-v2', async () => {
    try {
      const result = await $fetch('/api/sanity', { params: { type: 'siteSettings' } })
      return result || {}
    } catch (err) {
      console.warn('Failed to fetch site settings, using defaults:', err)
      return {}
    }
  })

  return {
    settings,
    error,
    pending,
    title: computed(() => settings.value?.title || 'Chelsea Beach'),
    contactInfo: computed(() => settings.value?.contactInfo || []),
    openingTimes: computed(() => settings.value?.openingTimes || []),
    linkedinUrl: computed(() => settings.value?.linkedinUrl || ''),
    instagramUrl: computed(() => settings.value?.instagramUrl || ''),
    preloaderImages: computed(() => settings.value?.preloaderImages || []),
    logotype: computed(() => settings.value?.logotype || null),
    bookingTitle: computed(() => settings.value?.bookingTitle || 'Book Your Appointment Now'),
    bookingLink: computed(() => settings.value?.bookingLink || ''),
    favicon: computed(() => settings.value?.favicon || {}),
    faviconUrl: computed(() => settings.value?.favicon?.favicon?.asset?.url || ''),
    faviconPngUrl: computed(() => settings.value?.favicon?.faviconPng?.asset?.url || ''),
    faviconDarkPngUrl: computed(() => settings.value?.favicon?.faviconDarkPng?.asset?.url || ''),
    appleTouchIconUrl: computed(() => settings.value?.favicon?.appleTouchIcon?.asset?.url || ''),
    androidIconUrl: computed(() => settings.value?.favicon?.androidIcon?.asset?.url || ''),
    disablePreloader: computed(() => settings.value?.disablePreloader === true)
  }
} 