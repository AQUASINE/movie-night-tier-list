<template>
  <div class="flex w-full">
    <TierList class="flex-1" ref="tierList"/>
    <SidebarComponent @screenshot="screenshot"/>
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
  methods: {
    screenshot() {
      this.$refs.tierList.screenshot();
    }
  }

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
