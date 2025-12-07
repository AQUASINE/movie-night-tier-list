export const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://api.movienighttierlist.com' : 'http://localhost:3008';

export const letterboxd = {
    namespaced: true,
    state: {
        searchResults: null,
        usernames: [],
        ratings: {},
        cacheMetadata: {},
        isScanning: false,
        movieStatsCache: {} // Precomputed stats for all movies
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
        },
        setCacheMetadata(state, metadata) {
            state.cacheMetadata = metadata;
        },
        setIsScanning(state, isScanning) {
            state.isScanning = isScanning;
        },
        setMovieStatsCache(state, cache) {
            state.movieStatsCache = cache;
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
        async refreshRatings({commit, state, dispatch, rootGetters}) {
            const response = await fetch(`${BASE_URL}/api/ratings/multiple?usernames=${state.usernames.join(',')}`);
            const data = await response.json();
            if (!data) {
                console.log('No ratings data received');
                return;
            }
            console.log('Refreshed ratings from cache', data);
            commit('setRatings', data);
            
            // Extract cache metadata
            const metadata = {};
            for (const username in data) {
                if (data[username].lastScan || data[username].lastUpdated) {
                    metadata[username] = {
                        lastScan: data[username].lastScan,
                        lastUpdated: data[username].lastUpdated
                    };
                }
            }
            commit('setCacheMetadata', metadata);
            
            // Precompute stats for all movies
            await dispatch('recomputeAllStats', null, { root: true });
            
            await dispatch('saveMetadataToLocalStorage', null, { root: true });
        },
        async saveUsernames({commit, state, dispatch}, usernames) {
            // Register new users with backend
            const response = await fetch(`${BASE_URL}/api/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usernames })
            });
            const result = await response.json();
            console.log('Registered users:', result);
            
            commit('setUsernames', usernames);
            await dispatch('saveMetadataToLocalStorage', null, { root: true });
            
            // Refresh ratings to get latest data
            await dispatch('refreshRatings');
        },
        async scanUserRatings({commit, state, dispatch}) {
            commit('setIsScanning', true);
            try {
                const response = await fetch(`${BASE_URL}/api/scan/multiple`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usernames: state.usernames.join(',') })
                });
                const data = await response.json();
                console.log('Scan complete', data);
                commit('setRatings', data);
                
                // Extract cache metadata
                const metadata = {};
                for (const username in data) {
                    if (data[username].lastScan || data[username].lastUpdated) {
                        metadata[username] = {
                            lastScan: data[username].lastScan,
                            lastUpdated: data[username].lastUpdated
                        };
                    }
                }
                commit('setCacheMetadata', metadata);
                
                // Precompute stats for all movies
                await dispatch('recomputeAllStats', null, { root: true });
                
                await dispatch('saveMetadataToLocalStorage', null, { root: true });
            } finally {
                commit('setIsScanning', false);
            }
        },
        async addUsername({state, commit, dispatch}, username) {
            if (!state.usernames.includes(username)) {
                const newUsernames = [...state.usernames, username];
                await dispatch('saveUsernames', newUsernames);
            }
        },
        async removeUsername({state, commit, dispatch}, username) {
            const newUsernames = state.usernames.filter(u => u !== username);
            await dispatch('saveUsernames', newUsernames);
        }
    }
}