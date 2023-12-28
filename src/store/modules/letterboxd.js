export const letterboxd = {
    namespaced: true,
    state: {
        searchResults: null
    },
    mutations: {
        setSearchResults(state, results) {
            state.searchResults = results;
        }
    },
    actions: {
        async search({commit}, query) {
            const safeQuery = encodeURIComponent(query);
            const response = await fetch(`http://localhost:3000/api/search?input=${safeQuery}&include=FilmSearchItem&perPage=20`)
            const data = await response.json();
            console.log(data);
            commit('setSearchResults', data.items);
        }
    }
}