<template>
  <div class="review-tab">
    <!-- User Management Section -->
    <div class="user-management">
      <h3 class="text-lg font-semibold mb-2">Letterboxd Users</h3>
      
      <div v-if="!isEditingUsers" class="users-display">
        <div class="users-chips">
          <span v-for="username in usernames" :key="username" class="user-chip">
            {{ username }}
          </span>
          <span class="user-count">({{ usernames.length }} users)</span>
        </div>
        <button class="btn-edit" @click="startEditingUsers">
          <v-icon icon="mdi-pencil"></v-icon>
          Edit
        </button>
      </div>
      
      <div v-else class="users-edit">
        <textarea 
          v-model="usernamesText" 
          class="usernames-textarea"
          placeholder="Enter one username per line"
          rows="6"
        ></textarea>
        <div class="edit-buttons">
          <button class="btn-save" @click="saveUsers" :disabled="isSavingUsers">
            <v-icon icon="mdi-check" v-if="!isSavingUsers"></v-icon>
            <v-icon icon="mdi-loading mdi-spin" v-else></v-icon>
            {{ isSavingUsers ? 'Saving...' : 'Save' }}
          </button>
          <button class="btn-cancel" @click="cancelEditingUsers">
            <v-icon icon="mdi-close"></v-icon>
            Cancel
          </button>
        </div>
      </div>
    </div>
    
    <!-- Scan Controls -->
    <div class="scan-controls mb-6">
      <div class="scan-status">
        <div class="cache-freshness" :class="freshnessClass">
          Last scanned: {{ lastScanText }}
        </div>
      </div>
      <div class="scan-buttons">
        <button class="btn-refresh" @click="refreshFromCache" :disabled="isScanning">
          <v-icon icon="mdi-refresh"></v-icon>
        </button>
        <button class="btn-scan" @click="scanUsers" :disabled="isScanning">
          <v-icon icon="mdi-loading mdi-spin" v-if="isScanning"></v-icon>
          <v-icon icon="mdi-magnify" v-else></v-icon>
          {{ isScanning ? 'Scanning...' : 'Start Scan' }}
        </button>
      </div>
      <div v-if="isScanning" class="scan-warning">
        Scanning Letterboxd... this may take several minutes
      </div>
    </div>
    
    <!-- Selected Movie Detail -->
    <div class="selected-movie mb-6" v-if="selectedEntry">
      <h3 class="text-lg font-semibold mb-3">Selected Movie</h3>
      <MovieReviewCard 
        :movie="selectedEntry"
        :stats="selectedMovieStats"
        :expanded="true"
        :non-collapsible="true"
      />
    </div>
    <div v-else class="no-selection mb-6">
      Click a movie to see detailed ratings
    </div>
    
    <!-- Tier List Reviews -->
    <div class="tier-list-reviews">
      <h3 class="text-lg font-semibold mb-3">All Movies (Right Side)</h3>
      <div class="scrollable-content">
        <div v-for="tier in rightSideTiers" :key="tier.id" class="tier-section">
          <div class="tier-header" @click="toggleTierCollapsed(tier.id)">
            <span>{{ tier.name }}</span>
            <span class="tier-count">({{ tier.movies.length }} movies)</span>
            <v-icon :icon="isTierCollapsed(tier.id) ? 'mdi-chevron-down' : 'mdi-chevron-up'" class="tier-toggle-icon"></v-icon>
          </div>
          <div v-if="!isTierCollapsed(tier.id)">
            <div v-if="tier.movies.length === 0" class="empty-tier">No movies in this tier</div>
            <MovieReviewCard 
              v-for="movie in tier.movies" 
              :key="movie.id"
              :movie="movie"
              :stats="getMovieStats(movie)"
              :expanded="expandedMovies[movie.id]"
              @toggle-expanded="toggleMovieExpanded(movie.id)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import MovieReviewCard from './MovieReviewCard.vue';

const store = useStore();

const isEditingUsers = ref(false);
const usernamesText = ref('');
const isSavingUsers = ref(false);
const expandedMovies = ref({});
const collapsedTiers = ref({});

const usernames = computed(() => store.state.letterboxd.usernames);
const selectedEntry = computed(() => store.state.selectedEntry);
const isScanning = computed(() => store.state.letterboxd.isScanning);
const cacheMetadata = computed(() => store.state.letterboxd.cacheMetadata);
const tiers = computed(() => store.state.tiers);
const rightContent = computed(() => store.state.rightContent);

const rightSideTiers = computed(() => {
  return tiers.value.map(tier => ({
    id: tier.id,
    name: tier.title,
    movies: rightContent.value[tier.id] || []
  }))
});

const lastScanText = computed(() => {
  const metadata = cacheMetadata.value;
  if (!metadata || Object.keys(metadata).length === 0) {
    return 'Never';
  }
  
  // Find the most recent scan
  let mostRecent = null;
  for (const username in metadata) {
    const lastScan = metadata[username]?.lastScan;
    if (lastScan) {
      const scanDate = new Date(lastScan);
      if (!mostRecent || scanDate > mostRecent) {
        mostRecent = scanDate;
      }
    }
  }
  
  if (!mostRecent) return 'Never';
  
  const now = new Date();
  const diffMs = now - mostRecent;
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffHours / 24;
  
  if (diffHours < 1) {
    return 'Less than 1 hour ago';
  } else if (diffHours < 24) {
    return `${Math.floor(diffHours)} hours ago`;
  } else {
    return `${Math.floor(diffDays)} days ago`;
  }
});

const freshnessClass = computed(() => {
  const metadata = cacheMetadata.value;
  if (!metadata || Object.keys(metadata).length === 0) {
    return 'freshness-red';
  }
  
  let mostRecent = null;
  for (const username in metadata) {
    const lastScan = metadata[username]?.lastScan;
    if (lastScan) {
      const scanDate = new Date(lastScan);
      if (!mostRecent || scanDate > mostRecent) {
        mostRecent = scanDate;
      }
    }
  }
  
  if (!mostRecent) return 'freshness-red';
  
  const now = new Date();
  const diffMs = now - mostRecent;
  const diffHours = diffMs / (1000 * 60 * 60);
  
  if (diffHours < 24) return 'freshness-green';
  if (diffHours < 168) return 'freshness-yellow'; // 7 days
  return 'freshness-red';
});

const selectedMovieStats = computed(() => {
  if (!selectedEntry.value) return null;
  const reviewData = store.getters.getMovieReviewData(selectedEntry.value);
  return {
    average: reviewData.basicStats.average,
    count: reviewData.basicStats.count,
    distribution: reviewData.basicStats.distribution,
    distributionCounts: reviewData.basicStats.distributionCounts,
    normalizedAverage: reviewData.normalizedAverage,
    matchedRatings: reviewData.matchedRatings
  };
});

function getMovieStats(movie) {
  const reviewData = store.getters.getMovieReviewData(movie);
  return {
    average: reviewData.basicStats.average,
    count: reviewData.basicStats.count,
    distribution: reviewData.basicStats.distribution,
    distributionCounts: reviewData.basicStats.distributionCounts,
    normalizedAverage: reviewData.normalizedAverage,
    matchedRatings: reviewData.matchedRatings
  };
}

function startEditingUsers() {
  usernamesText.value = usernames.value.join('\n');
  isEditingUsers.value = true;
}

function cancelEditingUsers() {
  isEditingUsers.value = false;
  usernamesText.value = '';
}

async function saveUsers() {
  isSavingUsers.value = true;
  try {
    const newUsernames = usernamesText.value
      .split('\n')
      .map(u => u.trim())
      .filter(u => u.length > 0);
    
    await store.dispatch('letterboxd/saveUsernames', newUsernames);
    isEditingUsers.value = false;
  } catch (error) {
    console.error('Error saving usernames:', error);
    alert('Failed to save usernames. Please try again.');
  } finally {
    isSavingUsers.value = false;
  }
}

async function refreshFromCache() {
  try {
    await store.dispatch('letterboxd/refreshRatings');
  } catch (error) {
    console.error('Error refreshing ratings:', error);
    alert('Failed to refresh ratings. Please try again.');
  }
}

async function scanUsers() {
  try {
    await store.dispatch('letterboxd/scanUserRatings');
  } catch (error) {
    console.error('Error scanning users:', error);
    alert('Failed to scan users. Please try again.');
  }
}

function toggleMovieExpanded(movieId) {
  expandedMovies.value[movieId] = !expandedMovies.value[movieId];
}

function toggleTierCollapsed(tierId) {
  collapsedTiers.value[tierId] = !collapsedTiers.value[tierId];
}

function isTierCollapsed(tierId) {
  // Default to collapsed (true) if not set
  return collapsedTiers.value[tierId] !== false;
}

onMounted(async () => {
  // Initialize all tiers as collapsed by default
  for (const tier of rightSideTiers.value) {
    collapsedTiers.value[tier.id] = true;
  }
  
  // Load initial ratings on mount
  await store.dispatch('letterboxd/refreshRatings');
});
</script>

<style scoped>
.review-tab {
  padding: 0;
  padding-top: 1rem;
  height: 100%;
  overflow-y: auto;
}

.user-management {
  border: 1px solid var(--bg4);
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 1rem;
}

.users-display {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.users-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.user-chip {
  background-color: var(--bg3);
  border: 1px solid var(--bg4);
  border-radius: 12px;
  padding: 4px 12px;
  font-size: 12px;
  color: var(--text1);
}

.user-count {
  color: #888888;
  font-size: 12px;
  margin-left: 4px;
}

.btn-edit, .btn-save, .btn-cancel, .btn-refresh, .btn-scan {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid var(--bg4);
  background-color: var(--bg3);
  color: #ffffff;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s;
}

.btn-edit {
    width: 100%;
    justify-content: center;

}

.btn-edit:hover, .btn-refresh:hover {
  background-color: #2a2a2a;
}

.btn-scan {
    width: 100%;
    justify-content: center;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.usernames-textarea {
  width: 100%;
  background-color: var(--bg2);
  border: 1px solid var(--bg4);
  border-radius: 4px;
  padding: 12px;
  color: #ffffff;
  font-family: monospace;
  font-size: 13px;
  resize: vertical;
  margin-bottom: 12px;
}

.edit-buttons {
  display: flex;
  gap: 8px;
}

.scan-controls {
  border: 1px solid var(--bg4);
  border-radius: 4px;
  padding: 16px;
}

.scan-status {
  margin-bottom: 12px;
}

.cache-freshness {
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 4px;
  display: inline-block;
}

.freshness-green {
  background-color: rgba(34, 197, 94, 0.2);
  color: #4ade80;
}

.freshness-yellow {
  background-color: rgba(234, 179, 8, 0.2);
  color: #facc15;
}

.freshness-red {
  background-color: rgba(239, 68, 68, 0.2);
  color: #f87171;
}

.scan-buttons {
  display: flex;
  gap: 8px;
}

.scan-warning {
  margin-top: 12px;
  padding: 8px 12px;
  background-color: rgba(234, 179, 8, 0.1);
  border: 1px solid rgba(234, 179, 8, 0.3);
  border-radius: 4px;
  font-size: 12px;
  color: #eab308;
}

.selected-movie {
  background-color: var(--bg3);
  border: 1px solid var(--bg4);
  border-radius: 4px;
  padding: 16px;
}

.no-selection {
  background-color: var(--bg3);
  border: 1px solid var(--bg4);
  border-radius: 4px;
  padding: 32px;
  text-align: center;
  color: #888888;
  font-style: italic;
}

.tier-list-reviews {
    padding-top: 1rem;
    border-top: 1px solid var(--bg4);
}

.scrollable-content {
  max-height: 600px;
  overflow-y: auto;
}

.tier-section {
  margin-bottom: 1rem;
}

.tier-header {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  padding: 8px 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--bg4);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.tier-header:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.tier-count {
  font-size: 12px;
  color: #888888;
  font-weight: normal;
  text-transform: none;
}

.tier-toggle-icon {
  margin-left: auto;
  color: var(--bg4);
}

.empty-tier {
  color: #888888;
  font-style: italic;
  font-size: 13px;
  padding: 12px;
}
</style>