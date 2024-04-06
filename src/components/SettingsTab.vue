<script>
import {mapState} from "vuex";
import packageJson from '../../package.json';


export default {
  name: "SettingsTab",
  computed: {
    ...mapState(['showAutotainment', 'disableDeleteWarning', 'showDream', 'showCloudggren'])
  },
  methods: {
    setAutotainment() {
      this.$store.dispatch('setAutotainment', !this.showAutotainment);
    },
    setDeleteWarning() {
      this.$store.dispatch('setDeleteWarning', !this.disableDeleteWarning);
    },
    getAutotainment() {
      return this.showAutotainment;
    },
    getDeleteWarning() {
      return this.disableDeleteWarning;
    },
    setDream() {
      this.$store.dispatch('setShowDream', !this.showDream);
    },
    getDream() {
      return this.showDream;
    },
    getCloudggren() {
      return this.showCloudggren;
    },
    setCloudggren() {
      this.$store.dispatch('setShowCloudggren', !this.showCloudggren);
    }
  },
  data() {
    return {
      version: packageJson.version,
      toggles: [
        {
          name: 'Show VeggieTales: The Wonderful World Of Auto-tainment!',
          value: this.getAutotainment,
          action: this.setAutotainment
        },
        {
          name: 'Disable Delete Warning on Ctrl-Shift-Click',
          value: this.getDeleteWarning,
          action: this.setDeleteWarning
        },
        {
          name: "Show Dream",
          value: this.getDream,
          action: this.setDream
        },
        {
          name: "Kill Berggren and put him in the clouds",
          value: this.getCloudggren,
          action: this.setCloudggren
        }
      ]
    }
  }
}
</script>

<template>
  <div class="flex flex-column justify-space-between flex-1">
    <div class="flex flex-column">
      <h1 class="font-bold text-2xl">Settings</h1>
      <div class="flex mt-3" v-for="toggle in toggles" @click="toggle.action" :key="toggle.name">
        <v-icon :icon="toggle.value() ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'"
                class="mr-2 mb-1"></v-icon>
        <label>{{ toggle.name }}</label>
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