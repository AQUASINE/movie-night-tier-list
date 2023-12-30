<template>
  <div>
    <draggable v-if="content" class="movie-list" :id="id">
      <div v-for="movie in content" :key="movie.name" @dragstart="handleDragStart(movie, id)">
        <img :src="movie.imageUrl" alt="movie image" class="tier-poster" :title="movie.name"/>
      </div>
    </draggable>
  </div>
</template>
<script>
import { VueDraggableNext } from "vue-draggable-next";

export default {
  name: 'TierContent',
  props: {
    id: {
      type: String,
      required: true,
    },
    content: {},
    side: {
      type: String,
      required: true,
    }
  },
  emits: ['dragstart'],
  components: {
    draggable: VueDraggableNext,
  },
  methods: {
    handleDragEnd(event) {
      const id = event.originalEvent?.target?.id
      if (id === 'dock') {
        return;
      }

      console.log(event);

      const tierId = id.split('-')[1];
      const tierSide = id.split('-')[0];
    },
    movieNameToId(name) {
      return name.replace(/[^a-zA-Z0-9]/g, '');
    },
    handleDragStart(movie, tierId) {
      console.log('dragstart TierContent')
      this.$emit('dragstart', {movie, tierId, tierSide: this.side});
    }
  }
}
</script>
<style scoped>


h1 {
  font-family: "Comic Sans MS", sans-serif;
  font-size: 40px;
  color: #ffffff;
}

.tier-poster {
  height: 65px;
  aspect-ratio: 27 / 40;
  min-width: 45px;
}

.tier-right {
  display: flex;
  justify-content: left;
  align-items: center;
}

.dock .movie-list {
  display: flex;
  justify-content: center;
}

.tier-left .movie-list {
  display: flex;
  flex-direction: row-reverse;
}

#valhalla-tier h1 {
  font-size: 20px;
  white-space: nowrap;
  overflow: hidden;
}

.movie-list {
  background-color: #1a1a1a;
  width: 100%;
  display: flex;
  height: 65px;
  overflow-x: visible;
}

.hideTierBg .movie-list {
  background-color: transparent !important;
}
</style>