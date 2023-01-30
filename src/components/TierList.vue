<template>
  <div class="tier-list">
    <h1>Tier List</h1>
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
  width: 60px;
  height: 60px;
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
</style>