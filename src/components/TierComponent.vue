<template>
  <div class="tier">
    <div class="tier-left">
      <slot name="left"></slot>
    </div>
    <div class="tier-letter"
         :style="{'background-color': backgroundColor, 'background-image': backgroundImage, color: textColor }">{{
        name
      }}
    </div>
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
    backgroundImage() {
      if (this.letterStyle && this.letterStyle["type"] === "image" && this.letterStyle["imageUrl"]) {
        return `url(${this.letterStyle["imageUrl"]})`;
      }
      return "none";
    },
    textColor() {
      if (this.letterStyle && this.letterStyle['textColor']) {
        return this.letterStyle['textColor'];
      }
      return 'black';
    }
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
  margin: 2px 4px;
}
</style>