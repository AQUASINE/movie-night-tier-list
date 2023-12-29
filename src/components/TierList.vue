<template>
  <div class="tier-list h-screen overflow-hidden" ref="tierList">
    <div class="fixed z-40">
      <v-slider v-model="zoom" direction="vertical" min="0.25" max="3" step="0.01" append-icon="mdi-magnify-plus-outline" prepend-icon="mdi-magnify-minus-outline" class="ma-4"/>
    </div>
    <div class="tiers-letters select-none" :style="{transform: 'scale(' + zoom + ') translateX(' + panAmountX + 'px) translateY(' + panAmountY + 'px)'}">
      <div class="header__movie-night">The Movie Night Tier List</div>
      <TierComponent v-for="tier in tiers" :name="tier.title" :id="tier.id" :key="tier.id" :letter-style="tier.style" class="flex justify-center align-center">
        <template #left>
          <TierContent :content="getContent(leftContent, tier)" class="tier-left" :class="{hideTierBg: tier.id === 'valhalla'}"/>
        </template>
        <template #right>
          <TierContent :content="getContent(rightContent, tier)" class="tier-right flex-1"/>
        </template>
      </TierComponent>
    </div>
  </div>
</template>

<script>
import TierComponent from "@/components/TierComponent.vue";
import TierContent from "@/components/TierContent.vue";
import {mapState} from "vuex";

export default {
  name: "TierList",
  components: {TierContent, TierComponent},
  mounted() {
    // when the spacebar is pressed, allow panning
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space" && this.isMouseInTierList) {
        this.isPanningAllowed = true;
        this.$refs.tierList.style.cursor = "grab";
        e.preventDefault();
      }

      // if tilde is pressed, reset zoom and pan
      if (e.code === "Backquote") {
        this.zoom = 1.0;
        this.panAmountX = 0;
        this.panAmountY = 100;
      }
    });

    // when the spacebar is released, stop panning
    window.addEventListener("keyup", (e) => {
      if (e.code === "Space") {
        this.isPanningAllowed = false;
        this.$refs.tierList.style.cursor = "default";
      }
    });

    this.$refs.tierList.addEventListener("mousedown", (e) => {
      this.isMouseInTierList = true;
      if (e.button === 1) {
        this.isPanning = true;
      }
      if (this.isPanningAllowed) {
        this.isPanning = true;
      }
    });

    this.$refs.tierList.addEventListener("mouseleave", () => {
      this.isMouseInTierList = false;
    });

    window.addEventListener("mouseup", () => {
      this.isPanning = false;
    });

    this.$refs.tierList.addEventListener("wheel", (e) => {
      if (e.ctrlKey) {
        this.zoom -= e.deltaY / 1000 * this.zoom;
        if (this.zoom < 0.25) {
          this.zoom = 0.25;
        } else if (this.zoom > 3) {
          this.zoom = 3;
        }
        e.preventDefault();
      } else if (e.shiftKey) {
        this.panAmountX -= e.deltaY / this.zoom * 0.33;
      }
      else {
        this.panAmountY -= e.deltaY / this.zoom * 0.33;
        this.panAmountX -= e.deltaX / this.zoom * 0.33 * window.innerWidth / window.innerHeight;
      }
    });



    window.addEventListener("mousemove", (e) => {
      if (this.isPanning) {
        this.panAmountX += e.movementX / this.zoom;
        this.panAmountY += e.movementY / this.zoom;
      }
    });

  },
  computed: {
    ...mapState(["tiers", 'leftContent', 'rightContent']),
  },
  watch: {
    zoom() {
      console.log(this.zoom);

      // if near 1, snap to 1
      if (this.zoom > 0.9 && this.zoom < 1.1) {
        this.zoom = 1.0;
      }
    }
  },
  data() {
    return {
      zoom: 1.0,
      panAmountX: 0,
      panAmountY: 100,
      isPanAllowed: false,
      isPanning: false,
    }
  },
  methods: {
    getContent(content, tier) {
      if (!content || content[tier.id] === undefined) {
        console.log("no content");
      }
      return {
        type: "movie-list",
        value: content[tier.id]
      }
    }
  }
}
</script>

<style scoped>


h1 {
  font-family: "Comic Sans MS", sans-serif;
  font-size: 40px;
  color: #ffffff;
}

.tier {
  display: grid;
  grid-template-columns: 1fr 0fr 1fr;
}

#valhalla-tier h1 {
  font-size: 20px;
  white-space: nowrap;
  overflow: hidden;
}


.tier-left {
  width: 1400px;
}

.tier-right {
  width: 2200px;
}

.header__movie-night {
  font-family: "Comic Sans MS", sans-serif;
  font-size: 40px;
  color: #ffffff;
  text-align: center;
  position: relative;
  margin-bottom: -60px;
  left: 0;
  top: 0;
  white-space: nowrap;
  transform: translateX(-1000px);
}
</style>