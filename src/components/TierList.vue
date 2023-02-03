<template>
  <div class="tier-list">
    <div class="tiers-letters">
      <TierComponent v-for="tier in tiers" :name="tier.title" :id="tier.id" :key="tier.id" :letter-style="tier.style">
        <template #left>
          <TierContent :content="tier.leftContent" class="tier-left"/>
        </template>
        <template #right>
          <TierContent :content="tier.rightContent" class="tier-right"/>
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
  data() {
    return {
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

#valhalla-tier h1 {
  font-size: 20px;
  white-space: nowrap;
  overflow: hidden;
}


</style>