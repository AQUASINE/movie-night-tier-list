<template>
  <div class="movie-review-card" :class="{ expanded: expanded }">
    <div class="card-header" @click="toggleExpanded">
      <div class="card-main">
        <img v-if="movie.imageUrl" :src="movie.imageUrl" class="poster-thumbnail" :alt="movie.name" />
        <div class="card-info">
          <div class="movie-title">{{ movie.name }}</div>
          <div class="ratings-summary">
            <span class="primary-rating">{{ formattedAverage }}</span>
            <span class="adjusted-rating">Adj: {{ formattedAdjusted }}</span>
          </div>
        </div>
      </div>
      <div class="expand-icon">
        <v-icon :icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon>
      </div>
    </div>
    
    <div class="chart-container" v-if="stats.count > 0">
      <svg class="bar-chart" viewBox="0 0 200 50" preserveAspectRatio="none">
        <g v-for="(percentage, index) in stats.distribution" :key="index">
          <rect
            :x="index * 20"
            :y="50 - (percentage * 0.5)"
            width="18"
            :height="percentage * 0.5"
            fill="rgba(99, 102, 241, 0.8)"
            stroke="rgba(99, 102, 241, 1)"
            stroke-width="0.5"
          >
            <title>{{ getTooltipText(index) }}</title>
          </rect>
        </g>
      </svg>
    </div>
    
    <div class="warning-banner" v-if="stats.count === 0">
      <v-icon icon="mdi-alert" class="warning-icon"></v-icon>
      No ratings matched. Add slug in Edit Entry tab to link ratings.
    </div>
    
    <div class="ratings-list" v-if="expanded && stats.count > 0">
      <div class="rating-item" v-for="rating in sortedRatings" :key="rating.username">
        <span class="username">{{ rating.username }}</span>
        <span class="stars">{{ '★'.repeat(rating.rating) }}</span>
        <span class="rating-value">{{ rating.rating }}/10</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MovieReviewCard',
  props: {
    movie: {
      type: Object,
      required: true
    },
    stats: {
      type: Object,
      required: true
    },
    expanded: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    formattedAverage() {
      if (this.stats.average === null || this.stats.count === 0) {
        return '--';
      }
      return `${this.stats.average.toFixed(1)}★ (${this.stats.count})`;
    },
    formattedAdjusted() {
      if (this.stats.normalizedAverage === null || this.stats.normalizedAverage === undefined) {
        return '--';
      }
      return `${this.stats.normalizedAverage.toFixed(1)}★`;
    },
    sortedRatings() {
      if (!this.stats.matchedRatings) return [];
      return [...this.stats.matchedRatings].sort((a, b) => b.rating - a.rating);
    }
  },
  methods: {
    toggleExpanded() {
      this.$emit('toggle-expanded');
    },
    getTooltipText(index) {
      const count = this.stats.distributionCounts ? this.stats.distributionCounts[index] : 0;
      const rating = index + 1;
      return count === 1 ? `${count} rating (${rating}★)` : `${count} ratings (${rating}★)`;
    }
  }
};
</script>

<style scoped>
.movie-review-card {
  background-color: var(--bg3);
  border: 1px solid var(--bg4);
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.movie-review-card:hover {
  background-color: #2a2a2a;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-main {
  display: flex;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.poster-thumbnail {
  width: 40px;
  height: 59px;
  object-fit: cover;
  border-radius: 2px;
  flex-shrink: 0;
}

.card-info {
  flex: 1;
  min-width: 0;
}

.movie-title {
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.ratings-summary {
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 13px;
}

.primary-rating {
  color: #ffffff;
  font-weight: 500;
}

.adjusted-rating {
  color: #888888;
  font-size: 12px;
}

.expand-icon {
  color: var(--bg4);
  flex-shrink: 0;
}

.chart-container {
  height: 50px;
  margin-top: 12px;
  margin-bottom: 8px;
}

.bar-chart {
  width: 100%;
  height: 100%;
}

.warning-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(234, 179, 8, 0.1);
  border: 1px solid rgba(234, 179, 8, 0.3);
  border-radius: 4px;
  padding: 8px 12px;
  margin-top: 12px;
  font-size: 12px;
  color: #eab308;
}

.warning-icon {
  font-size: 16px;
}

.ratings-list {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--bg4);
  max-height: 300px;
  overflow-y: auto;
}

.rating-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  font-size: 13px;
}

.username {
  font-weight: 500;
  min-width: 80px;
}

.stars {
  color: #fbbf24;
  font-size: 12px;
  letter-spacing: 1px;
}

.rating-value {
  color: #888888;
  font-size: 12px;
  margin-left: auto;
}
</style>
