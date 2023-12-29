<template>
  <div class="sidebar bg2 pa-4">
    <div class="flex flex-column justify-space-between h-100">
      <div>
        <h1 class="font-bold text-2xl">Add Entry</h1>
        <div>
          <input type="text" class="w-full border-bg4 pa-2 mt-2" placeholder="Search Letterboxd" v-model="searchText"
                 @input="searchLetterboxd"/>
          <div class="divide-y-1 divide-color-white h-52 overflow-scroll border-bg4 mt-4 pl-2">
            <div v-for="result in formattedSearchResults" :key="result.name" @click="setSelected(result)"
                 class="flex items-center mt-2 divide-y-1 divide-color-white overflow-hidden whitespace-nowrap text-ellipsis">
              <img :src="result.imageUrl" class="search-image" :title="result.name" height="30"/>
              <span class="ml-2">{{ result.name }}</span>
            </div>
          </div>
          <div class="mt-4">
            <input type="text" placeholder="Title" class="w-full border-bg4 pa-2 mt-2" v-model="selectedInfo.name"/>
            <div class="opacity-30">Letterboxd ID: {{ selectedInfo.id }}</div>
            <div class="flex mt-4">
              <img :src="selectedInfo.imageUrl" class="uploaded-image mr-3"/>
              <div>
                <label for="image-upload" class="cursor-pointer">Enter image url</label>
                <input type="text" placeholder="Image URL" class="w-full border-bg4 pa-2 mt-2"
                       v-model="selectedInfo.imageUrl"/>
              </div>
            </div>
            <div class="mt-4 button__soBadItsGood" :class="{selected: isTierLeft}" @click="toggleLeftSide">
              <v-icon :icon="isTierLeft ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'"
                      class="mr-2 mb-1"></v-icon>
              So Bad It's Good
            </div>
            <div class="mt-3 mb-1">
              <label for="tier-select">Select a Tier: </label>
              <select name="tier-select" class="tier-select" v-model="selectedTier">
                <option :value="tier" v-for="tier in tierValues" :key="tier">{{ getTierName(tier) }}</option>
              </select>

            </div>
          </div>
        </div>
      </div>
      <button class="w-full border-bg4 pa-3 mt-2" @click="addEntry">Add</button>
    </div>
  </div>
</template>
<script>
import {mapState} from "vuex";

export default {
  name: 'SidebarComponent',
  computed: {
    ...mapState('letterboxd', ['searchResults']),
    ...mapState(['tiers', 'leftContent', 'rightContent']),
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
    },
    tierValues() {
      // use keys from leftContent or rightContent depending on isTierLeft
      const content = this.isTierLeft ? this.leftContent : this.rightContent;
      return Object.keys(content);
    }
  },
  data() {
    return {
      searchDebounce: null,
      searchText: '',
      selectedTier: '',
      isTierLeft: false,
      selectedInfo: {
        name: '',
        id: '',
      },
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
      this.selectedInfo = {...result};
    },
    toggleLeftSide() {
      this.isTierLeft = !this.isTierLeft;
    },
    addEntry() {
      if (!this.selectedTier) return;

      const selectedInfo = {...this.selectedInfo};
      const payload = {
        film: selectedInfo,
        tier: this.selectedTier,
        isLeft: this.isTierLeft,
      }
      this.$store.dispatch('addEntry', payload);
    },
    getTierName(tier) {
      return this.tiers.find((t) => t.id === tier)?.title;
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

.uploaded-image {
  height: 120px;
  aspect-ratio: 27 / 40;
  border-radius: 4px;
  border: 1px solid var(--bg4);
}

.sidebar {
  width: 400px;
  overflow: scroll;
  max-height: 100vh;
}

.button__soBadItsGood {
  border: 1px solid #ffffff;
  padding: 14px 10px 10px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  border-radius: 4px;
}

.button__soBadItsGood.selected {
  background-color: #ffffff;
  color: var(--bg2);
}

.tier-select {
  background-color: var(--bg3);
  color: #ffffff;
  border: 1px solid var(--bg4);
  padding: 4px;
  width: 120px;
  border-radius: 4px;
  margin-left: 6px;
}
</style>