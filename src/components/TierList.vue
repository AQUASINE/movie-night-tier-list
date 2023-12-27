<template>
  <div class="tier-list h-screen overflow-hidden" ref="tierList">
    <div class="fixed z-40">
      <v-slider v-model="zoom" direction="vertical" min="0.25" max="3" step="0.01" append-icon="mdi-magnify-plus-outline" prepend-icon="mdi-magnify-minus-outline" class="ma-4"/>
    </div>
    <div class="tiers-letters select-none" :style="{transform: 'scale(' + zoom + ') translateX(' + panAmountX + 'px) translateY(' + panAmountY + 'px)'}">
      <TierComponent v-for="tier in tiers" :name="tier.title" :id="tier.id" :key="tier.id" :letter-style="tier.style">
        <template #left>
          <TierContent :content="tier.leftContent" class="tier-left"/>
        </template>
        <template #right>
          <TierContent :content="tier.rightContent" class="tier-right flex-1"/>
        </template>
      </TierComponent>
    </div>
  </div>
</template>

<script>
import TierComponent from "@/components/TierComponent.vue";
import TierContent from "@/components/TierContent.vue";

export default {
  name: "TierList",
  components: {TierContent, TierComponent},
  mounted() {
    // when the spacebar is pressed, allow panning
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        this.isPanningAllowed = true;
        this.$refs.tierList.style.cursor = "grab";
        e.preventDefault();
      }

      // if tilde is pressed, reset zoom and pan
      if (e.code === "Backquote") {
        this.zoom = 1.0;
        this.panAmountX = 0;
        this.panAmountY = 0;
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
      if (e.button === 1) {
        this.isPanning = true;
      }
      if (this.isPanningAllowed) {
        this.isPanning = true;
      }
    });

    window.addEventListener("mouseup", (e) => {
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
      }
    });


    window.addEventListener("mousemove", (e) => {
      if (this.isPanning) {
        this.panAmountX += e.movementX / this.zoom;
        this.panAmountY += e.movementY / this.zoom;
      }
    });

  },
  methods: {
  
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
      panAmountY: 0,
      isPanAllowed: false,
      isPanning: false,
      tiers: [
        {
          id: "valhalla",
          title: "Valhalla",
          style: {
            type: "image",
            imageUrl: "https://images.pexels.com/photos/53594/blue-clouds-day-fluffy-53594.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            textColor: "white",
          },
          leftContent: {
            type: "html",
            value: "<div>test</div>"
          },
          rightContent: {
            type: "movie-list",
            value: [
              {
                name: "Baby Driver",
                imageUrl: "https://a.ltrbxd.com/resized/film-poster/2/6/8/9/5/0/268950-baby-driver-0-500-0-750-crop.jpg?v=61304ddfc8",
              },
              {
                name: "Spider-Man: Into the Spider-Verse",
                imageUrl: "https://a.ltrbxd.com/resized/film-poster/2/5/1/9/4/3/251943-spider-man-into-the-spider-verse-0-500-0-750-crop.jpg?v=5d25123839"
              },
              {
                name: "The Willoughbys",
                imageUrl: "https://a.ltrbxd.com/resized/film-poster/4/8/8/5/8/9/488589-the-willoughbys-0-500-0-750-crop.jpg?v=6adf75f49f"
              },
              {
                name: "Isle of Dogs",
                imageUrl: "https://a.ltrbxd.com/resized/sm/upload/z2/5l/zn/to/uMcbu3qVseJGH24xUAyIVzmcQV4-0-500-0-750-crop.jpg?v=8bc488a9ff"
              },
              {
                name: "Puss in Boots 2: The Last Wish",
                imageUrl: "https://a.ltrbxd.com/resized/film-poster/2/4/2/2/8/5/242285-puss-in-boots-the-last-wish-0-500-0-750-crop.jpg?v=9e9109c5cd"
              },
              {
                name: "Superbad",
                imageUrl: "https://a.ltrbxd.com/resized/film-poster/4/7/7/7/6/47776-superbad-0-500-0-750-crop.jpg?v=b43686efcb"
              }
            ]
          }
        },
        {
          id: "s",
          title: "S",
          style: {
            type: "color",
            "background-color": "#ff7f7f"
          },
          leftContent: {
            type: "movie-list",

          },
        },
        {
          id: "a",
          title: "A",
          style: {
            type: "color",
            "background-color": "#febe7e"
          }
        },
        {
          id: "b",
          title: "B",
          style: {
            type: "color",
            "background-color": "#ffff7f"
          }
        },
        {
          id: "c",
          title: "C",
          style: {
            type: "color",
            "background-color": "#7fff7f"
          }
        },
        {
          id: "d",
          title: "D",
          style: {
            type: "color",
            "background-color": "#7fbfff"
          }
        },
        {
          id: "e",
          title: "E",
          style: {
            type: "color",
            "background-color": "#7f7ffe"
          }
        },
        {
          id: "f",
          title: "F",
          style: {
            type: "color",
            "background-color": "#ff7fff"
          }
        },
        {
          id: "shadowrealm",
          title: "Shadow Realm",
          style: {
            type: "color",
            "background-color": "#400d59"
          }
        },
        {
          id: "chips",
          title: "CHIPS",
          style: {
            type: "color",
            "background-color": "white"
          }
        },
      ]
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


</style>