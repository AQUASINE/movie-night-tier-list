<template>
  <div class="tier">
    <div class="tier-left">
      <slot name="left"></slot>
    </div>
    <div class="tier-letter" :style="{'background-color': backgroundColor}">{{ name }}</div>
    <div class="tier-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "TierComponent",
  props: {
    name: {
      type: String,
      required: true,
    },
    letterStyle: {
      type: Object,
      required: false,
    },
  },
computed: {
    backgroundColor() {
      if (this.letterStyle && this.letterStyle["type"] === "color" && this.letterStyle["background-color"]) {
        return this.letterStyle["background-color"];
      }
      return "black";
    },
  },
}
</script>

<style scoped>
.tier-letter {
  width: 65px;
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin: 4px;
}
</style>