<template>
  <div>
    <div v-if="content && content.type === 'movie-list'" class="movie-list">
      <div v-for="movie in content.value" :key="movie.name">
        <img :src="movie.imageUrl" alt="movie image" class="tier-poster" :title="movie.name"/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TierContent',
  props: {
    content: {}
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
}

.tier-right {
  display: flex;
  justify-content: left;
  align-items: center;
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
  align-items: start;
  height: 65px;
}
</style>