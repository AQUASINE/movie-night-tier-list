import {store} from "@/store/store";

export const initialize = async () => {
    await store.dispatch('loadTiersFromFile');
    await store.dispatch('loadFromLocalStorage');
}