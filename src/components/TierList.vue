<template>
  <div class="tier-list h-screen overflow-hidden" ref="tierList">
    <div class="fixed z-40">
      <v-slider v-model="zoom" direction="vertical" min="0.25" max="3" step="0.01"
                append-icon="mdi-magnify-plus-outline" prepend-icon="mdi-magnify-minus-outline" class="ma-4"/>
    </div>
    <div class="tiers-letters select-none"
         :style="{transform: 'scale(' + zoom + ') translateX(' + panAmountX + 'px) translateY(' + panAmountY + 'px)'}">
      <div class="header__movie-night">The Movie Night Tier List</div>
      <TierComponent v-for="tier in tiers" :name="tier.title" :id="tier.id" :key="tier.id" :letter-style="tier.style"
                     class="flex justify-center align-center">
        <template #left>
          <TierContent :content="getContent(leftContent, tier)" class="tier-left" :id="`${tier.id}`" side="left"
                       :class="{hideTierBg: tier.id === 'valhalla'}" @dragstart="handleDragStart" @drop="handleDrop('left', tier.id)"/>
        </template>
        <template #right>
          <TierContent :content="getContent(rightContent, tier)" :id="`${tier.id}`" class="tier-right flex-1" side="right"
                       @dragstart="handleDragStart" @drop="handleDrop('right', tier.id)"/>
        </template>
      </TierComponent>
    </div>
    <TierContent :content="dock" id="dock" class="dock" @dragstart="handleDragStart" @drop="handleDrop('dock', 'dock')" side="dock"/>
  </div>
</template>

<script>
import TierComponent from "@/components/TierComponent.vue";
import TierContent from "@/components/TierContent.vue";
import {mapState} from "vuex";

export default {
  name: "TierList",
  components: {TierContent, TierComponent},
  computed: {
    ...mapState(["tiers", 'leftContent', 'rightContent', 'dock']),
  },
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
      } else {
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
      draggedMovie: null,
      sourceTierId: null,
      sourceTierSide: null,
    }
  },
  methods: {
    handleDrop(tierSide, tierId) {
      console.log("drop in tierlist", tierSide, tierId);
      if (!this.draggedMovie || !this.sourceTierId) {
        console.log("no dragged movie or source tier id");
        return;
      }

      const payload = {
        movie: this.draggedMovie,
        sourceTierId: this.sourceTierId,
        sourceTierSide: this.sourceTierSide,
        targetTierId: tierId,
        targetTierSide: tierSide,
      }
      console.log("dispatching moveEntry", payload)

      this.$store.dispatch('moveEntry', payload);

      this.draggedMovie = null;
      this.sourceTierId = null;
    },
    getContent(content, tier) {
      if (!content || content[tier.id] === undefined) {
        return null;
      }
      return content[tier.id];
    },
    handleDragStart({movie, tierId, tierSide}) {
      console.log("drag start in tierlist")
      this.draggedMovie = movie;
      this.sourceTierId = tierId;
      this.sourceTierSide = tierSide;
    },
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

.dock {
  position: fixed;
  bottom: 0;
  left: 20px;
  height: 100px;
  width: 40%;
  display: flex;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  background-color: #1a1a1a;
  border: 1px solid var(--bg4);
  border-bottom: none;
  justify-content: center;
  align-items: center;
}
</style>