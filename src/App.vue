<template>
  <TierList/>
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
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  background-color: #000000;
  color: #ffffff;
}
</style>
