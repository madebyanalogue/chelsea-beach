import { defineEventHandler, getQuery, setHeader, sendError, createError } from 'h3'

// Very small proxy to fetch SVG content server-side to avoid browser CORS
// Only allows whitelisted hosts for safety
const ALLOWED_HOSTS = new Set([
  'cdn.sanity.io'
])

export default defineEventHandler(async (event) => {
  const { url } = getQuery(event) as { url?: string }
  if (!url) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Missing url' }))
  }

  try {
    const target = new URL(Array.isArray(url) ? url[0] : url)
    if (!ALLOWED_HOSTS.has(target.hostname)) {
      return sendError(event, createError({ statusCode: 400, statusMessage: 'Host not allowed' }))
    }

    const res = await fetch(target.toString(), { method: 'GET' })
    if (!res.ok) {
      return sendError(event, createError({ statusCode: res.status, statusMessage: `Upstream error ${res.status}` }))
    }

    const svg = await res.text()
    setHeader(event, 'Content-Type', 'image/svg+xml; charset=utf-8')
    setHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=600')
    // Optional CORS for other consumers
    setHeader(event, 'Access-Control-Allow-Origin', '*')
    return svg
  } catch (error: any) {
    return sendError(event, createError({ statusCode: 500, statusMessage: error?.message || 'Proxy failed' }))
  }
})


