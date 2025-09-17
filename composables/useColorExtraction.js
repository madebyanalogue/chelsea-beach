import { ref } from 'vue'

export const useColorExtraction = () => {
  const extractedColors = ref(new Map())

  // Predefined color palette for fallback - muted and natural
  const fallbackColors = [
    'rgb(120, 100, 80)',   // Warm brown
    'rgb(100, 120, 100)',  // Muted green
    'rgb(120, 110, 100)',  // Beige
    'rgb(110, 100, 120)',  // Muted purple
    'rgb(100, 100, 100)',  // Neutral gray
    'rgb(130, 110, 90)',   // Warm taupe
    'rgb(90, 110, 100)',   // Sage green
    'rgb(110, 120, 110)',  // Soft green
    'rgb(100, 90, 110)',   // Muted lavender
    'rgb(120, 100, 90)',   // Warm beige
  ]

  const extractColorFromImage = async (imageUrl) => {
    try {
      const response = await $fetch('/api/extract-color', {
        method: 'POST',
        body: { imageUrl }
      })
      
      if (response.success) {
        return response.color
      } else {
        console.warn('Color extraction failed, using fallback:', response.error)
        return fallbackColors[Math.floor(Math.random() * fallbackColors.length)]
      }
    } catch (error) {
      console.error('Error calling color extraction API:', error)
      // Return a fallback color
      return fallbackColors[Math.floor(Math.random() * fallbackColors.length)]
    }
  }

  const getColorForGallery = (galleryId) => {
    return extractedColors.value.get(galleryId)
  }

  const setColorForGallery = (galleryId, color) => {
    extractedColors.value.set(galleryId, color)
  }

  return {
    extractColorFromImage,
    getColorForGallery,
    setColorForGallery,
    extractedColors
  }
}
