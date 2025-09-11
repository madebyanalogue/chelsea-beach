import { defineEventHandler, readBody } from 'h3'
import { createCanvas, loadImage } from 'canvas'

export default defineEventHandler(async (event) => {
  try {
    const { imageUrl } = await readBody(event)
    
    if (!imageUrl) {
      throw new Error('Image URL is required')
    }

    // Load the image
    const image = await loadImage(imageUrl)
    
    // Create a canvas
    const canvas = createCanvas(50, 50)
    const ctx = canvas.getContext('2d')
    
    // Draw the image on canvas
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    
    // Calculate average color
    let r = 0, g = 0, b = 0, count = 0
    
    for (let i = 0; i < data.length; i += 4) {
      r += data[i]
      g += data[i + 1]
      b += data[i + 2]
      count++
    }
    
    // Get average values
    r = Math.round(r / count)
    g = Math.round(g / count)
    b = Math.round(b / count)
    
    return {
      color: `rgb(${r}, ${g}, ${b})`,
      success: true
    }
  } catch (error) {
    console.error('Error extracting color:', error)
    console.error('Image URL that failed:', imageUrl)
    
    // Return natural fallback colors
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
    
    const fallbackColor = fallbackColors[Math.floor(Math.random() * fallbackColors.length)]
    
    return {
      color: fallbackColor,
      success: false,
      error: error.message
    }
  }
})
