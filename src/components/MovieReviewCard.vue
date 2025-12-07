<template>
  <div class="movie-review-card" :class="{ expanded: expanded, 'non-collapsible': nonCollapsible }" @click="!nonCollapsible && toggleExpanded()">
    <div class="card-header">
      <div class="card-main">
        <img v-if="movie.imageUrl" :src="movie.imageUrl" class="poster-thumbnail" :alt="movie.name" />
        <div class="card-info">
          <div class="movie-title">{{ movie.name }}</div>
          <div class="ratings-summary">
            <span class="primary-rating">{{ formattedAverage }}</span>
            <div class="inline-chart" v-if="stats.count > 0">
              <svg class="bar-chart" viewBox="0 0 200 50" preserveAspectRatio="none">
                <g v-for="(percentage, index) in stats.distribution" :key="index">
                  <rect
                    :x="index * 20"
                    :y="50 - (percentage * 0.5)"
                    width="18"
                    :height="percentage * 0.5"
                    :fill="getBarColor(index)"
                    :stroke="getBarColor(index)"
                    rx="3"
                    ry="3"
                    stroke-width="0.5"
                  >
                    <title>{{ getTooltipText(index) }}</title>
                  </rect>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div class="expand-icon" v-if="!nonCollapsible">
        <v-icon :icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon>
      </div>
    </div>
    
    <div class="warning-banner" v-if="stats.count === 0">
      <v-icon icon="mdi-alert" class="warning-icon"></v-icon>
      No ratings matched. Add slug in Edit Entry tab to link ratings.
    </div>
    
    <div class="ratings-list" v-if="expanded && stats.count > 0" :class="{ 'has-scroll': sortedRatings.length > 8 }">
      <div class="rating-item" v-for="rating in sortedRatings" :key="rating.username">
        <span class="username">{{ rating.username }}</span>
        <span class="stars" :style="{ color: getBarColor(rating.rating - 1) }">
          <v-icon 
            v-for="n in getFullStars(rating.rating)" 
            :key="'full-' + n" 
            icon="mdi-star" 
            :color="getBarColor(rating.rating - 1)"
            size="18"
          ></v-icon>
          <v-icon 
            v-if="hasHalfStar(rating.rating)" 
            icon="mdi-star-half" 
            :color="getBarColor(rating.rating - 1)"
            size="18"
          ></v-icon>
        </span>
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
    },
    nonCollapsible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    formattedAverage() {
      if (this.stats.average === null || this.stats.count === 0) {
        return '--';
      }
      return `${this.stats.average.toFixed(1)}/10★ (${this.stats.count})`;
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
    },
    getBarColor(index) {
        switch (index) {
            // 1 out of 10: red
          case 0: return '#ff1452';
            // 2 out of 10: red-orange  
          case 1: return '#f9514c';
            // 3 out of 10: orange
            case 2: return '#f96316';
            // 4 out of 10: yellow-orange
          case 3: return '#ffb400';
            // 5 out of 10: yellow
            case 4: return '#ffdd00';
            // 6 out of 10: yellow-green
            case 5: return '#b6f000';
            // 7 out of 10: light green
            case 6: return '#66d900';
            // 8 out of 10: green
            case 7: return '#28b775';
            // 9 out of 10: blue-green
            case 8: return '#00a6fd';
            // 10 out of 10: blue
            case 9: return '#0072ff';
        }
    },
    getFullStars(rating) {
      // Convert 10-point scale to 5-star display
      const stars = rating / 2;
      return Math.floor(stars);
    },
    hasHalfStar(rating) {
      const stars = rating / 2;
      return stars % 1 >= 0.5;
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

.movie-review-card.non-collapsible {
  cursor: default;
  border: none;
  padding: 0;
  background-color: transparent;
}

.movie-review-card.non-collapsible:hover {
  background-color: transparent;
}

.movie-review-card.non-collapsible .card-header {
  cursor: default;
  padding: 0;
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
  white-space: nowrap;
}

.inline-chart {
  width: 120px;
  height: 30px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  margin-top: 0.25rem;
  padding: 2px;
  flex-shrink: 0;
  margin-left: 0.25rem;
}

.bar-chart {
  width: 100%;
  height: 100%;
}

.expand-icon {
  color: var(--bg4);
  flex-shrink: 0;
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
  position: relative;
}

.ratings-list.has-scroll {
  max-height: 250px;
  overflow-y: auto;
  padding-right: 1rem;
}

.rating-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.username {
  font-weight: 500;
  min-width: 100px;
}

.stars {
  display: flex;
  align-items: center;
  gap: 2px;
}

.rating-value {
  color: #888888;
  font-size: 13px;
  margin-left: auto;
}

.scroll-indicator {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to bottom, transparent, var(--bg3) 50%);
  text-align: center;
  padding: 12px 0 4px;
  font-size: 11px;
  color: #888888;
  pointer-events: none;
}
</style>
