<template>
  <div class="flex w-full">
    <TierList class="flex-1"/>
    <SidebarComponent/>
  </div>
</template>

<script>
import TierList from "@/components/TierList.vue";
import SidebarComponent from "@/SidebarComponent.vue";

export default {
  name: 'App',
  components: {
    SidebarComponent,
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
