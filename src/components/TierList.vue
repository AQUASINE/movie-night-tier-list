<template>
  <div class="tier-list">
    <div class="tiers-letters">
      <div class="tier" id="valhalla-tier">
        <div class="tier-left">
          <h1>The Movie Night Tier List</h1>
        </div>
        <div class="tier-letter" id="valhalla">Valhalla</div>
        <div class="tier-right">
          <img class="tier-poster" src="https://a.ltrbxd.com/resized/film-poster/2/4/2/2/8/5/242285-puss-in-boots-the-last-wish-0-500-0-750-crop.jpg?v=9e9109c5cd" alt="puss in boots"/>
        </div>
      </div>
      <div class="tier-letter" id="s">S</div>
      <div class="tier-letter" id="a">A</div>
      <div class="tier-letter" id="b">B</div>
      <div class="tier-letter" id="c">C</div>
      <div class="tier-letter" id="d">D</div>
      <div class="tier-letter" id="e">E</div>
      <div class="tier-letter" id="f">F</div>
      <div class="tier-letter" id="shadowrealm">Shadow Realm</div>
      <div class="tier-letter" id="chips">CHIPS</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TierList"
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

h1 {
  font-family: "Comic Sans MS", sans-serif;
  font-size: 40px;
  color: #ffffff;
}

#s {
  background-color: #ff7f7f;
}

#a {
  background-color: #febe7e;
}

#b {
  background-color: #ffff7f;
}

#c {
  background-color: #7fff7f;
}

#d {
  background-color: #7fbfff;
}

#e {
  background-color: #7f7ffe;
}

#f {
  background-color: #ff7fff;
}

#shadowrealm {
  color: white;
  background-color: #400d59;
}

#chips {
  background-color: white;
}

#valhalla {
  background-color: #00ffa6;
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