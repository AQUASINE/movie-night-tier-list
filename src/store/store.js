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
        },
        setTierList(state, {left, right, dock}) {
            state.leftContent = left;
            state.rightContent = right;
            state.dock = dock;
        },
        changeTierOrder(state, {tierId, tierSide, event}) {
            const {oldIndex, newIndex} = event;
            let tier;
            if (tierSide === "left") {
                tier = state.leftContent[tierId];
            } else if (tierSide === "right") {
                tier = state.rightContent[tierId];
            } else if (tierSide === "dock") {
                tier = state.dock;
            }
            tier.splice(newIndex, 0, tier.splice(oldIndex, 1)[0]);
        },
        reverseLeftContent(state) {
            for (const tier in state.leftContent) {
                state.leftContent[tier].reverse();
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

            await this.dispatch('saveToLocalStorage');
        },
        async removeEntryFromTier({commit}, payload) {
            const {tierId, tierSide, entry} = payload;
            let tier;
            if (tierSide === "left") {
                tier = this.state.leftContent[tierId];
            } else if (tierSide === "right") {
                tier = this.state.rightContent[tierId];
            } else if (tierSide === "dock") {
                tier = this.state.dock;
            }

            const movieIndex = tier.findIndex(m => m.id === entry.id);
            tier.splice(movieIndex, 1);
            commit('setTierContent', {tierId, tierSide, content: tier});

            await this.dispatch('saveToLocalStorage');
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
        },
        async exportTierList() {
            const exportData = {
                left: this.state.leftContent,
                right: this.state.rightContent,
                dock: this.state.dock,
                date: new Date()
            }
            console.log("Exporting tier list", exportData);
            return exportData;
        },
        async exportTierListToFile() {
            const exportData = await this.dispatch('exportTierList');
            const data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData));
            let now = new Date();
            // use time zone offset to get local time
            let datetime = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + '-' + now.getHours() + '-' + now.getMinutes() + '-' + now.getSeconds();
            const a = document.createElement('a');
            a.href = 'data:' + data;
            a.download = `tierlist-${datetime}.json`
            a.innerHTML = 'download JSON';

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        },
        async saveToLocalStorage() {
            const exportData = await this.dispatch('exportTierList');
            localStorage.setItem('tierlist', JSON.stringify(exportData));
        },
        async loadFromLocalStorage({commit}) {
            const data = localStorage.getItem('tierlist');
            if (data === null) {
                console.log("No data in localStorage");
                return;
            }
            const parsedData = JSON.parse(data);
            console.log("Loaded data from localStorage", parsedData);
            localStorage.setItem('tierlist', JSON.stringify(parsedData));

            commit('setTierList', parsedData);
        },
        async importTierList({commit}, data) {
            console.log("Importing tier list", data);
            commit('setTierList', JSON.parse(data));
        },
        async changeTierOrder({commit}, payload) {
            commit('changeTierOrder', payload);
            await this.dispatch('saveToLocalStorage');
        },
        async clearTierList({commit}) {
            commit('setTierList', {
                left: {
                    "valhalla": [],
                    "s": [],
                    "a": [],
                    "b": [],
                    "c": [],
                    "d": [],
                    "e": [],
                    "f": [],
                },
                right: {
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
            });
            await this.dispatch('saveToLocalStorage');
        },
    }
});

function reverseLeftContent() {
    store.commit('reverseLeftContent');
}

window.reverseLeftContent = reverseLeftContent;