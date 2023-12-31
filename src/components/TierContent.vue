<template>
  <div class="container__movie-list">
    <draggable v-if="content" class="movie-list" :id="id" @change="onOrderChange" :list="content">
      <div v-for="movie in content" :key="movie.name" @dragstart="handleDragStart(movie, id)" @click="($event) => handleClick($event, movie)">
        <img :src="proxyImage(movie.imageUrl)" alt="movie image" class="tier-poster" :title="movie.name"/>
      </div>
    </draggable>
  </div>
</template>
<script>
import { VueDraggableNext } from "vue-draggable-next";

const PROXY_URL = "http://localhost:3000/image_proxy?url=";

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
    onOrderChange(evt) {
      console.log('onOrderChange', evt);
      this.$store.dispatch('changeTierOrder', {tierId: this.id, tierSide: this.side, event: evt});
    },
    handleDragStart(movie, tierId) {
      console.log('dragstart TierContent')
      this.$emit('dragstart', {movie, tierId, tierSide: this.side});
    },
    proxyImage(url) {
      if (!url) return;
      return `${PROXY_URL}${encodeURIComponent(url)}`;
    },
    handleClick(event, movie) {
      console.log('handleClick', event);
      // check if control and shift are pressed
      if (event.ctrlKey && event.shiftKey) {
        console.log('ctrl + shift + click');
        const confirm = window.confirm('Are you sure you want to remove this entry from the tier list?');
        if (!confirm) return;
        this.$store.dispatch('removeEntryFromTier', {
          entry: movie,
          tierId: this.id,
          tierSide: this.side
        });
      }
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
  width: 100%;
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

.tier-left .container__movie-list {
  padding-left: 10px;
}

.container__movie-list {
  width: 100%;
  flex: 1;
}
</style>