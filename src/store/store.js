import {createStore} from "vuex";
import {letterboxd} from "@/store/modules/letterboxd";

export const store = createStore({
    state: {
        tiers: [],
        leftContent: {
            "valhalla": [],
            "s": [],
            "a": [],
            "b": [],
            "c": [],
            "d": [],
            "e": [],
            "f": [],
        },
        rightContent: {
            "valhalla": [],
            "s": [],
            "a": [],
            "b": [],
            "c": [],
            "d": [],
            "e": [],
            "f": [],
            "shadowRealm": [],
            "chips": []
        },
    },
    modules: {
        letterboxd
    },
    mutations: {
        setTiers(state, tiers) {
            state.tiers = tiers;
        },
        addEntry(state, {film, tier, isLeft}) {
            if (isLeft && state.leftContent[tier]) {
                state.leftContent[tier].push(film);
            } else if (state.rightContent[tier]) {
                state.rightContent[tier].push(film);
            } else {
                console.error("Could not add entry", film, tier, isLeft);
            }
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
        },
        async addEntry({commit}, payload) {
            const {film, tier, isLeft} = payload;
            console.log("Adding entry", film, tier, isLeft)
            commit('addEntry', {film, tier, isLeft})
        }
    }
});