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
        dock: []
    },
    modules: {
        letterboxd
    },
    mutations: {
        setTiers(state, tiers) {
            state.tiers = tiers;
        },
        addEntry(state, {film, tier, isLeft}) {
            if (tier === '') {
                state.dock.unshift(film);
                return;
            }

            if (isLeft) {
                state.leftContent[tier].unshift(film);
            } else {
                state.rightContent[tier].unshift(film);
            }

        },
        setTierContent(state, {tierId, tierSide, content}) {
            if (tierSide === "left") {
                state.leftContent[tierId] = content;
            } else if (tierSide === "right") {
                state.rightContent[tierId] = content;
            } else if (tierSide === "dock") {
                state.dock = content;
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
        },
        async moveEntry({commit}, payload) {
            // payload contains movie, sourceTierId, sourceTierSide, targetTierId, targetTierSide
            // sourceTierSide can be dock, left, right

            // find movie in source tier and remove
            const {sourceTierId, sourceTierSide, movie} = payload;
            const {targetTierId, targetTierSide} = payload;

            if (sourceTierId === targetTierId && sourceTierSide === targetTierSide) {
                console.log("Source and target are the same, no move needed");
                if (sourceTierSide === "dock") {
                    console.log(this.state.dock);
                } else if (sourceTierSide === "left") {
                    console.log(this.state.leftContent[sourceTierId]);
                } else if (sourceTierSide === "right") {
                    console.log(this.state.rightContent[sourceTierId]);
                }
                return;
            }

            let sourceTier;
            if (sourceTierSide === "dock") {
                sourceTier = this.state.dock;
            } else if (sourceTierSide === "left") {
                sourceTier = this.state.leftContent[sourceTierId];
            } else if (sourceTierSide === "right") {
                sourceTier = this.state.rightContent[sourceTierId];
            }

            const movieIndex = sourceTier.findIndex(m => m.id === movie.id);
            sourceTier.splice(movieIndex, 1);
            commit('setTierContent', {tierId: sourceTierId, tierSide: sourceTierSide, content: sourceTier});

            // add movie to target tier
            let targetTier;

            if (targetTierSide === "left") {
                targetTier = this.state.leftContent[targetTierId];
            } else if (targetTierSide === "right") {
                targetTier = this.state.rightContent[targetTierId];
            } else if (targetTierSide === "dock") {
                targetTier = this.state.dock;
            }
            // put at top of tier for now
            targetTier.unshift(movie);
            commit('setTierContent', {tierId: targetTierId, tierSide: targetTierSide, content: targetTier});
        }
    }
});