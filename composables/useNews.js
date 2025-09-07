import { ref, onMounted } from 'vue'

export const useNews = () => {
  const posts = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchNews = async () => {
    loading.value = true
    error.value = null
    
    try {
      const res = await $fetch('/api/sanity', { params: { type: 'news' } })
      posts.value = res
    } catch (err) {
      error.value = err
      console.error('Error fetching news:', err)
    } finally {
      loading.value = false
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    // Get month name in uppercase
    const month = date.toLocaleString('en-US', { month: 'long' }).toUpperCase()
    const year = date.getFullYear()
    return `${month} ${year}`
  }

  // Fetch news on mount
  onMounted(() => {
    fetchNews()
  })

  return {
    posts,
    loading,
    error,
    fetchNews,
    formatDate
  }
} 