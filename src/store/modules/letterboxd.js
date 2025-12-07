export const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://api.movienighttierlist.com' : 'http://localhost:3008';

export const letterboxd = {
    namespaced: true,
    state: {
        searchResults: null,
        usernames: ['aquasine', 'ovengoats'],
        ratings: {}
    },
    mutations: {
        setSearchResults(state, results) {
            state.searchResults = results;
        },
        setUsernames(state, usernames) {
            state.usernames = usernames;
        },
        setRatings(state, ratings) {
            state.ratings = ratings;
        }
    },
    actions: {
        async search({commit}, query) {
            const safeQuery = encodeURIComponent(query);
            const response = await fetch(`${BASE_URL}/api/search?input=${safeQuery}&include=FilmSearchItem&perPage=20`)
            const data = await response.json();
            console.log(data);
            commit('setSearchResults', data.items);
        },
        async fetchRatings({commit}, usernames) {
            const response = await fetch(`${BASE_URL}/api/ratings/multiple?usernames=${usernames.join(',')}`);
            const data = await response.json();
            if (!data) {
                console.log('No ratings data received');
                return;
            }
            console.log(data);
            commit('setRatings', data);
        },
        async addUsername({state, commit, dispatch}, username) {
            if (!state.usernames.includes(username)) {
                const newUsernames = [...state.usernames, username];
                commit('setUsernames', newUsernames);
                await dispatch('fetchRatings', newUsernames);
            }
        },
        async removeUsername({state, commit}, username) {
            const newUsernames = state.usernames.filter(u => u !== username);
            commit('setUsernames', newUsernames);
        }
    }
}