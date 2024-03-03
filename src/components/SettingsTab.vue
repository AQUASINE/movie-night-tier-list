<script>
import {mapState} from "vuex";
import packageJson from '../../package.json';


export default {
  name: "SettingsTab",
  computed: {
    ...mapState(['showAutotainment', 'disableDeleteWarning'])
  },
  methods: {
    setAutotainment() {
      this.$store.dispatch('setAutotainment', !this.showAutotainment);
    },
    setDeleteWarning() {
      this.$store.dispatch('setDeleteWarning', !this.disableDeleteWarning);
    }
  },
  data() {
    return {
      version: packageJson.version
    }
  }
}
</script>

<template>
  <div class="flex flex-column justify-space-between flex-1">
    <div class="flex flex-column">
      <h1 class="font-bold text-2xl">Settings</h1>
      <div class="flex mt-3" @click="setAutotainment">
        <v-icon :icon="showAutotainment ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'"
                class="mr-2 mb-1"></v-icon>
        <label for="autotain">Show VeggieTales: The Wonderful World Of Auto-tainment!</label>
      </div>
      <div class="flex mt-3" @click="setDeleteWarning">
        <v-icon :icon="disableDeleteWarning ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'"
                class="mr-2 mb-1"></v-icon>
        <label for="autotain">Disable Delete Warning on Ctrl-Shift-Click</label>
      </div>
    </div>
    <div>
      <img src="/logo-text.svg" class="logo -mb-4" alt="Movie Night Tier List Logo" width="200"/>
      <div class="opacity-30 mt-4">v{{ version }}</div>
    </div>
  </div>
</template>

<style scoped>

</style>