<template>
  <div class="tier-list">
    <div class="tiers-letters">
      <div class="tier" id="valhalla-tier">
        <div class="tier-left">
          <h1>The Movie Night Tier List</h1>
        </div>
        <div class="tier-letter" id="valhalla">Valhalla</div>
        <img class="tier-poster"
             src="https://a.ltrbxd.com/resized/film-poster/2/4/2/2/8/5/242285-puss-in-boots-the-last-wish-0-500-0-750-crop.jpg?v=9e9109c5cd"
             alt="puss in boots"/>
      </div>
      <TierComponent v-for="tier in tiers" :name="tier.title" :id="tier.id" :key="tier.id" :letter-style="tier.style">
        <template #left>
          Test Left
        </template>
        <template #right>
          Test Right
        </template>
      </TierComponent>
    </div>
  </div>
</template>

<script>
import TierComponent from "@/components/TierComponent.vue";

export default {
  name: "TierList",
  components: {TierComponent},
  data() {
    return {
      tiers: [
        {
          id: "valhalla",
          title: "Valhalla",
          style: {
            type: "color",
            "background-color": "#00ff9d"
          },
          leftContent: {
            type: "html",
            value: "<div>test</div>"
          }
        },
        {
          id: "s",
          title: "S",
          style: {
            type: "color",
            "background-color": "#ff7f7f"
          }
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

.tier-poster {
  height: 65px;
  aspect-ratio: 27 / 40;
}

.tier-right {
  display: flex;
  justify-content: left;
  align-items: center;
}

#valhalla-tier h1 {
  font-size: 20px;
  white-space: nowrap;
  overflow: hidden;
}
</style>