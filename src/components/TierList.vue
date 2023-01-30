<template>
  <div class="tier-list">
    <h1>The Movie Night Tier List</h1>
    <div class="tiers-letters">
      <div class="tier-letter" id="valhalla">Valhalla</div>
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
</style>