import {createStore} from "vuex";
import {letterboxd} from "@/store/modules/letterboxd";

export const store = createStore({
    state: {
        tiers: []
    },
    modules: {
        letterboxd
    },
    mutations: {
        setTiers(state, tiers) {
            state.tiers = tiers;
        }
    },
    actions: {
        async loadTiersFromFile({commit}) {
            try {
            const response = await fetch('/tiers.json');
            const tiers = await response.json();
            console.log("Loaded tiers.json", tiers);
            commit('setTiers', tiers);
            } catch (e) {
                console.error("Could not load tiers.json", e);
            }
        }
    }
});