/**
 * Match a movie to its ratings across all users
 * @param {Object} movie - Movie object with letterboxdId and optional slug
 * @param {Object} ratingsData - Ratings data from all users (from letterboxd state)
 * @returns {Array} Array of matched rating objects with username
 */
export function matchMovieToRatings(movie, ratingsData) {
    const matchedRatings = [];
    
    for (const username in ratingsData) {
        const userData = ratingsData[username];
        const posterIdIndex = userData.posterIdIndex || {};
        const ratings = userData.ratings || {};
        
        let matchedRating = null;
        
        // Try to match by LID (letterboxdId) using posterIdIndex
        if (movie.letterboxdId && posterIdIndex[movie.letterboxdId]) {
            const filmId = posterIdIndex[movie.letterboxdId];
            matchedRating = ratings[filmId];
        }
        
        // Fallback: try to match by slug
        if (!matchedRating && movie.slug) {
            for (const filmId in ratings) {
                const rating = ratings[filmId];
                if (rating.slug === movie.slug) {
                    matchedRating = rating;
                    break;
                }
            }
        }
        
        if (matchedRating && matchedRating.rating) {
            matchedRatings.push({
                username,
                rating: matchedRating.rating,
                reviewUrl: matchedRating.reviewUrl,
                slug: matchedRating.slug
            });
        }
    }
    
    return matchedRatings;
}

/**
 * Calculate basic statistics from a list of ratings
 * @param {Array} ratingsList - Array of rating objects with rating property
 * @returns {Object} Statistics object with average, count, and distribution
 */
export function calculateBasicStats(ratingsList) {
    if (!ratingsList || ratingsList.length === 0) {
        return {
            average: null,
            count: 0,
            distribution: Array(10).fill(0)
        };
    }

    console.log('Calculating stats for ratings list:', ratingsList);
    
    const count = ratingsList.length;
    const sum = ratingsList.reduce((acc, r) => acc + r.rating, 0);
    const average = sum / count;
    
    // Calculate distribution (1-10 stars as percentages)
    const distributionCounts = Array(10).fill(0);
    for (const r of ratingsList) {
        const index = r.rating - 1; // rating 1-10 -> index 0-9
        if (index >= 0 && index < 10) {
            distributionCounts[index]++;
        }
    }
    
    // Convert to percentages
    const distribution = distributionCounts.map(c => (c / count) * 100);
    
    return {
        average,
        count,
        distribution,
        distributionCounts // Keep counts for tooltips
    };
}

/**
 * Calculate z-score normalized ratings across tier list movies
 * @param {Array} allTierListMovies - All movies in the tier list
 * @param {Object} ratingsData - Ratings data from all users
 * @returns {Object} Map of movieId to normalized average rating
 */
export function calculateZScoreNormalized(allTierListMovies, ratingsData) {
    const normalizedScores = {};
    
    // First, collect all ratings per user across the tier list
    const userRatings = {};
    
    for (const movie of allTierListMovies) {
        const matchedRatings = matchMovieToRatings(movie, ratingsData);
        
        for (const r of matchedRatings) {
            if (!userRatings[r.username]) {
                userRatings[r.username] = [];
            }
            userRatings[r.username].push({
                movieId: movie.id,
                rating: r.rating
            });
        }
    }
    
    // Calculate mean and stddev for each user
    const userStats = {};
    for (const username in userRatings) {
        const ratings = userRatings[username].map(r => r.rating);
        const count = ratings.length;
        
        if (count === 0) continue;
        
        const mean = ratings.reduce((acc, r) => acc + r, 0) / count;
        
        if (count === 1) {
            // Can't normalize with only one rating
            userStats[username] = { mean, stddev: 1, count };
            continue;
        }
        
        const variance = ratings.reduce((acc, r) => acc + Math.pow(r - mean, 2), 0) / count;
        const stddev = Math.sqrt(variance);
        
        userStats[username] = {
            mean,
            stddev: stddev || 1, // Avoid division by zero
            count
        };
    }
    
    // Now calculate normalized scores for each movie
    for (const movie of allTierListMovies) {
        const matchedRatings = matchMovieToRatings(movie, ratingsData);
        
        if (matchedRatings.length === 0) {
            normalizedScores[movie.id] = null;
            continue;
        }
        
        const normalizedValues = [];
        
        for (const r of matchedRatings) {
            const stats = userStats[r.username];
            if (!stats) continue;
            
            // Calculate z-score: (rating - mean) / stddev
            const zScore = (r.rating - stats.mean) / stats.stddev;
            normalizedValues.push(zScore);
        }
        
        if (normalizedValues.length === 0) {
            normalizedScores[movie.id] = null;
        } else {
            // Average the z-scores and convert back to 1-10 scale
            const avgZScore = normalizedValues.reduce((acc, z) => acc + z, 0) / normalizedValues.length;
            
            // Scale z-score back to approximate 1-10 range
            // Typical z-score range is -3 to +3, map to 1-10
            // z-score of 0 (average) -> 5.5
            // z-score of -3 -> 1, z-score of +3 -> 10
            const scaledScore = 5.5 + (avgZScore * 1.5);
            normalizedScores[movie.id] = Math.max(1, Math.min(10, scaledScore));
        }
    }
    
    return normalizedScores;
}
