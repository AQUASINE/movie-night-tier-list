<template>
  <div class="flex w-full">
  <TierList class="flex-1"/>
  <div class="w-1/4 bg2 pa-4">
    <h1 class="font-bold text-2xl">Add Entry</h1>
  </div>
  </div>
</template>

<script>
import TierList from "@/components/TierList.vue";

export default {
  name: 'App',
  components: {
    TierList,
  },

}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background-color: #000000;
  color: #ffffff;
}
</style>
