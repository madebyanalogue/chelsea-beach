import { ref, computed } from 'vue'

export const useTeam = () => {
  const teamMembers = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Fetch all team members using the API endpoint
  const fetchTeamMembers = async () => {
    loading.value = true
    error.value = null
    
    try {
      const result = await $fetch('/api/sanity', { 
        params: { 
          type: 'team'
        } 
      })
      teamMembers.value = result || []
    } catch (err) {
      error.value = err.message
      console.error('Error fetching team members:', err)
      teamMembers.value = []
    } finally {
      loading.value = false
    }
  }

  // Get team members ordered by orderRank field
  const orderedTeamMembers = computed(() => {
    return [...teamMembers.value].sort((a, b) => (a.orderRank || '').localeCompare(b.orderRank || ''))
  })

  // Get team members ordered by name
  const teamMembersByName = computed(() => {
    return [...teamMembers.value].sort((a, b) => a.name.localeCompare(b.name))
  })

  return {
    teamMembers,
    orderedTeamMembers,
    teamMembersByName,
    loading,
    error,
    fetchTeamMembers
  }
}
