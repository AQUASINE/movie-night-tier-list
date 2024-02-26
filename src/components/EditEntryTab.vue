<script>
import {mapState} from "vuex";

export default {
  name: "EditEntryTab",
  computed: {
    ...mapState(['selectedEntry'])
  },
  methods: {
    saveEntry() {
      this.$store.dispatch('updateEntry', this.entry)
    },
  },
  data() {
    return {
      entry: null
    }
  },
  watch: {
    selectedEntry: {
      immediate: true,
      handler(val) {
        this.entry = JSON.parse(JSON.stringify(val));
      }
    }
  }
}
</script>

<template>
  <div class="flex flex-column justify-space-between flex-1">
    <h1 class="font-bold text-2xl">Edit Entry</h1>
    <div class="mt-4 flex-1" v-if="entry">
      <input type="text" placeholder="Title" class="w-full border-bg4 pa-2 mt-2" v-model="entry.name"/>
      <div class="opacity-30">Letterboxd ID: {{ entry.letterboxdId }}</div>
      <div class="flex mt-4">
        <div class="uploaded-image-wrap mr-3">
          <img :src="entry.imageUrl" class="uploaded-image" alt="" v-if="entry.imageUrl"/>
        </div>
        <div>
          <label for="image-upload" class="cursor-pointer">Enter image url</label>
          <input type="text" placeholder="Image URL" class="w-full border-bg4 pa-2 mt-2"
                 v-model="entry.imageUrl"/>
        </div>
      </div>
    </div>
    <div v-else class="flex-1 mt-3">
      Click on an entry to edit.
    </div>
    <button class="w-full addbutton pa-3 mt-2" @click="saveEntry" :class="{disable: !formValid}">Save</button>
  </div>
</template>

<style scoped>

</style>