<template>
  <section class="section-team">
    <div class="team-container">

      <!-- Team Members Grid -->
      <div v-if="teamMembers.length > 0" class="team-grid">
        <div 
          v-for="member in teamMembers" 
          :key="member._id"
          class="team-member"
        >
          <div class="member-image">
            <img 
              :src="member.imageUrl" 
              :alt="member.imageAlt || member.name"
              class="profile-image"
            />
          </div>
          <div class="member-info">
            <h3 class="member-name">{{ member.name }}</h3>
            <p v-if="member.role" class="member-role">{{ member.role }}</p>
            <p v-if="member.bio" class="member-bio">{{ member.bio }}</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="loading" class="team-loading">
        <p>Loading team members...</p>
      </div>

      <!-- Empty State -->
      <div v-else class="team-empty">
        <p>No team members found.</p>
        <p>Debug: Loading: {{ loading }}, Count: {{ teamMembers.length }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'

const props = defineProps({
  section: {
    type: Object,
    required: true
  }
})

// Use the team composable
const { orderedTeamMembers, loading, fetchTeamMembers } = useTeam()

// Get team members
const teamMembers = computed(() => orderedTeamMembers.value)

// Fetch team members on mount
onMounted(async () => {
  await fetchTeamMembers()
})
</script>

<style scoped>
.team-section {
  width: 100%;
  padding: var(--section-padding, 4rem 0);
}

.team-container {
  max-width: var(--container-width, 1200px);
  margin: 0 auto;
  padding: 0 var(--container-padding, 1rem);
}

.team-header {
  text-align: center;
  margin-bottom: 3rem;
}

.team-title {
  font-size: var(--h2);
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--dark-grey);
}

.team-description {
  font-size: var(--body);
  color: var(--grey);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.team-member {
  text-align: center;
  background: var(--white);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.team-member:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.member-image {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.member-info {
  padding: 1.5rem;
}

.member-name {
  font-size: var(--h4);
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--dark-grey);
}

.member-role {
  font-size: var(--body);
  font-weight: 500;
  color: var(--yellow);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.member-bio {
  font-size: var(--body);
  color: var(--grey);
  line-height: 1.6;
  margin: 0;
}

.team-loading,
.team-empty {
  text-align: center;
  padding: 3rem;
  color: var(--grey);
  font-size: var(--body);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .team-section {
    padding: var(--section-padding, 2rem 0);
  }
  
  .team-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  .team-header {
    margin-bottom: 2rem;
  }
  
  .member-info {
    padding: 1rem;
  }
}
</style>
