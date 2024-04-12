<template>
  <div class="sidebar bg2 flex flex-column">
    <div class="flex container__sidebar-tabs">
      <div v-for="tab in tabs" :key="tab.id" class="item__sidebar-tab" :class="{selected: isTabSelected(tab.id)}" @click="selectedTab = tab.id">
        <v-icon :icon="tab.icon"/>
      </div>
    </div>
    <div class="flex flex-column justify-space-between flex-1 pa-4 pt-4">
      <div class="flex flex-column flex-1">
        <div class="mb-3 flex justify-space-between">
          <div>
        <button @click="importTierList" class="border-bg4 pa-4 pt-1 pb-1 mr-3">Load</button>
        <button @click="exportTierList" class="border-bg4 pa-4 pt-1 pb-1">Save</button>
            <button @click="screenshotTierList" class="border-bg4 pa-4 pt-1 pb-1 ml-3 text-s"><v-icon icon="mdi-camera-outline" class="-mt-1"/></button>
          </div>
          <button @click="resetTierList" class="reset-button pa-4 pt-1 pb-1">Clear</button>
        </div>
        <AddEntryTab v-if="isTabSelected('add')"/>
        <EditEntryTab v-if="isTabSelected('edit')"/>
        <SettingsTab v-if="isTabSelected('settings')"/>
      </div>
    </div>
  </div>
</template>
<script>
import AddEntryTab from "@/components/AddEntryTab.vue";
import EditEntryTab from "@/components/EditEntryTab.vue";
import SettingsTab from "@/components/SettingsTab.vue";

export default {
  name: 'SidebarComponent',
  components: {SettingsTab, EditEntryTab, AddEntryTab},
  computed: {

  },
  emits: ['screenshot'],
  data() {
    return {
      tabs: [{
        id: 'add',
        name: 'Add Entry',
        icon: 'mdi-plus'
      },
        {
          id: 'edit',
          name: 'Edit Entry',
          icon: 'mdi-pencil'
        },
        {
          id: 'settings',
          name: 'Settings',
          icon: 'mdi-cog'
        },
      ],
      selectedTab: 'add',
    }
  },
  methods: {
    importTierList() {
      // open file picker
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;
          this.$store.dispatch('importTierList', content);
        }
        reader.readAsText(file);
      }
      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    },
    async exportTierList() {
      await this.$store.dispatch('exportTierListToFile');
    },
    isTabSelected(tab) {
      return this.selectedTab === tab;
    },
    resetTierList() {
      // show prompt
      const confirmed = confirm('Are you sure you want to clear your tier list?');
      if (!confirmed) return;
      this.$store.dispatch('clearTierList');
    },
    screenshotTierList() {
      this.$emit('screenshot');
    }
  }
}
</script>
<style>

body {
  background-color: #000000;
  color: #ffffff;
}

.sidebar {
  width: 400px;
  overflow: auto;
  max-height: 100vh;
  z-index: 1000;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.addbutton {
  background-color: #ffffff;
  color: var(--bg2);
  border: 1px solid #ffffff;
  border-radius: 4px;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out, border 0.2s ease-in-out;
}

.addbutton.disable {
  background-color: var(--bg4);
  color: var(--bg2);
  border: 1px solid var(--bg4);
}

.reset-button {
  background-color: var(--bg2);
  color: var(--color-warning);
  border: 1px solid var(--color-warning);
  border-radius: 4px;
}

.item__sidebar-tab {
  height: 35px;
  margin-top: 4px;
  max-width: 75px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid var(--bg4);
  border-top: 1px solid var(--bg4);
  border-left: 1px solid var(--bg4);
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  color: var(--bg4);
  margin-right: 4px;
}

.item__sidebar-tab:first-child {
}

.item__sidebar-tab.selected {
  background-color: var(--primary);
  color: var(--bg2);
}


.container__sidebar-tabs {
  border-bottom: 1px solid var(--bg4);
  padding: 0 5px;
}
</style>