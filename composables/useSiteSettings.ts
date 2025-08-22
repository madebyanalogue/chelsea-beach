import { useAsyncData } from '#app'
import { computed } from 'vue'

export const useSiteSettings = () => {
  const { data: settings, error, pending } = useAsyncData('siteSettings-v2', () =>
    $fetch('/api/sanity', { params: { type: 'siteSettings' } })
  )

  return {
    settings,
    error,
    pending,
    title: computed(() => settings.value?.title),
    contactInfo: computed(() => settings.value?.contactInfo || []),
    footerLogos: computed(() => {
      if (!settings.value?.footerLogos) return []
      return settings.value.footerLogos
        .filter((logo: { asset?: { url?: string } }) => !!logo?.asset?.url)
        .map((logo: { asset: { url: string } }) => logo.asset.url)
    }),
    certificationLogo: computed(() => settings.value?.certificationLogo?.asset?.url),
    ftCreditLogo: computed(() => settings.value?.ftCreditLogo?.asset?.url),
    menuBackgroundImage: computed(() => settings.value?.menuBackgroundImage),
    linkedinUrl: computed(() => settings.value?.linkedinUrl),
    preloaderImages: computed(() => settings.value?.preloaderImages || [])
  }
} 