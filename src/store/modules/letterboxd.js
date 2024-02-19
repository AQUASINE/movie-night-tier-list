export const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://api.movienighttierlist.com' : 'http://localhost:3008';

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
            const response = await fetch(`${BASE_URL}/api/search?input=${safeQuery}&include=FilmSearchItem&perPage=20`)
            const data = await response.json();
            console.log(data);
            commit('setSearchResults', data.items);
        }
    }
}