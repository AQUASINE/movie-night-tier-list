import {store} from "@/store/store";

export const initialize = async () => {
    await store.dispatch('loadTiersFromFile');
    await store.dispatch('loadFromLocalStorage');
    await store.dispatch('loadMetadataFromLocalStorage');
    await store.dispatch('letterboxd/fetchRatings', store.state.letterboxd.usernames);
}