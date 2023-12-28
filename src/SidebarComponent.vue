<template>
  <div class="w-1/4 bg2 pa-4">
    <h1 class="font-bold text-2xl">Add Entry</h1>
    <div>
      <h2>Search Letterboxd</h2>
      <input type="text" class="w-full border-bg4 pa-2 mt-2" placeholder="Search for a movie" v-model="searchText" @input="searchLetterboxd"/>
      <div class="divide-y-1 divide-color-white h-80 overflow-scroll border-bg4 mt-4 pl-2">
        <div v-for="result in formattedSearchResults" :key="result.name" @click="setSelected(result)"
             class="flex items-center mt-2 divide-y-1 divide-color-white overflow-hidden whitespace-nowrap text-ellipsis">
          <img :src="result.imageUrl"  class="search-image" :title="result.name" height="30"/>
          <span class="ml-2">{{ result.name }}</span>
        </div>
      </div>
      <div v-if="selectedInfo">
        {{ selectedInfo }}
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from "vuex";

export default {
  name: 'SidebarComponent',
  computed: {
    ...mapState('letterboxd', ['searchResults']),
    formattedSearchResults() {
      if (!this.searchResults) return;
      return this.searchResults.map((result) => {
        const film = result.film;
        return {
          name: film.name,
          imageUrl: film.poster?.sizes[0].url,
          id: film.id,
        }
      })
    }
  },
  data() {
    return {
      searchDebounce: null,
      searchText: '',
      selectedInfo: null,
    }
  },
  methods: {
    searchLetterboxd() {
      const query = this.searchText;
      clearTimeout(this.searchDebounce);
      this.searchDebounce = setTimeout(() => {
        this.$store.dispatch('letterboxd/search', query);
      }, 500);
    },
    setSelected(result) {
      this.selectedInfo = result;
    }
  }
}
</script>
<style>

body {
  background-color: #000000;
  color: #ffffff;
}

.search-image {
  height: 45px;
  aspect-ratio: 27 / 40;
}
</style>