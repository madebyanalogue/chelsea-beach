import { ref } from 'vue'

export const useColorExtraction = () => {
  const extractedColors = ref(new Map())

  // Predefined color palette for fallback
  const fallbackColors = [
    'rgb(255, 99, 132)',   // Pink
    'rgb(54, 162, 235)',   // Blue
    'rgb(255, 205, 86)',  // Yellow
    'rgb(75, 192, 192)',  // Teal
    'rgb(153, 102, 255)', // Purple
    'rgb(255, 159, 64)',  // Orange
    'rgb(199, 199, 199)', // Gray
    'rgb(83, 102, 255)',  // Indigo
    'rgb(78, 205, 196)',  // Mint
    'rgb(255, 107, 107)', // Red
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
