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
    
    // Return a fallback color
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
    
    const fallbackColor = fallbackColors[Math.floor(Math.random() * fallbackColors.length)]
    
    return {
      color: fallbackColor,
      success: false,
      error: error.message
    }
  }
})
