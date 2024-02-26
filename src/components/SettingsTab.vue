<script>
import {mapState} from "vuex";

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
  </div>
</template>

<style scoped>

</style>