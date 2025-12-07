<template>
    <div>
        <h2>Reviews</h2>
        <h4>Add all user links here</h4>
        <div>
            {{ usernames }}
        </div>
        <div>
            {{ leftSideTiers }}
        </div>
        <div>
            {{ rightSideTiers }}
        </div>
        <div>
            {{ ratings }}
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
const store = useStore();
const usernames = computed(() => store.state.letterboxd.usernames);
const rightSideTiers = computed(() => store.state.rightContent);
const leftSideTiers = computed(() => store.state.leftContent);

const ratings = computed(() => store.state.letterboxd.ratings);
</script>

<style scoped>
</style>