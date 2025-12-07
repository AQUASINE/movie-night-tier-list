// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const https = require('https');
const cheerio = require('cheerio');

const app = express();
const port = 3008; // You can choose any available port

// fetch every image in tierlist-cached.json
const fs = require('fs');
const path = require('path');

const cachedTierlistPath = path.join(__dirname, 'assets', 'tierlist-cached.json');
const cachePath = path.join(__dirname, 'images');
const tierlist = JSON.parse(fs.readFileSync(cachedTierlistPath));
const imageUrls = [];

const BASE_URL = 'http://localhost:' + port;

const addImagesToList = (side) => {
    // side is an object with keys that correspond to each tier
    for (const tier of Object.values(side)) {
        for (const movie of tier) {
            imageUrls.push(movie.imageUrl);
        }
    }
}

addImagesToList(tierlist.left);
addImagesToList(tierlist.right);

// fetch and save images
const fetchAndSaveImage = async (url) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/image_proxy?url=${encodeURIComponent(url)}`,
            {
                responseType: 'arraybuffer',
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            }
        );
        // remove query parameters from the URL
        const filename = url.split('/').pop().split('?')[0];
        console.log(`Saving ${filename}`);
        fs.writeFileSync(path.join(cachePath, filename), response.data);
    } catch (error) {
        console.error(error);
    }
}

const fetchAndSaveImages = async () => {
    for (const url of imageUrls) {
        await fetchAndSaveImage(url);
    }
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const ratingsDbPath = path.join(__dirname, 'ratings-db.json');
const loadRatingsDb = () => {
    return fs.existsSync(ratingsDbPath)
        ? JSON.parse(fs.readFileSync(ratingsDbPath))
        : {};
};
let ratingsDb = loadRatingsDb();

const saveRatingsDb = () => {
    fs.writeFileSync(ratingsDbPath, JSON.stringify(ratingsDb, null, 2));
}

const fetchUserPage = async (username, page = 1) => {
    const url = page === 1 ?
        `https://letterboxd.com/${username}/films/by/rated-date` :
        `https://letterboxd.com/${username}/films/by/rated-date/page/${page}/`;
    const res = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0',
            'Accept-Language': 'en-US',
        }
    });

    if (res.status !== 200) {
        console.log(`Failed to fetch page ${page} for user ${username}: ${res.status}`);
        return [];
    }

    const $ = cheerio.load(res.data);
    const items = []

    $('.poster-grid li.griditem').each((index, element) => {
        const root = $(element);

        const data = root.find('.react-component').data();
        const viewing = root.find('.poster-viewingdata');

        if (!data || !data.itemSlug) {
            console.log(`No data found for element at index ${index}`);
            return;
        }
        console.log("data:", data);
        const slug = data.itemSlug;
        const filmId = data.filmId;
        const posterId = data.posteredIdentifier?.lid || null;
        const ratingNode = viewing.find('.rating');

        let rating = 0;
        if (ratingNode.length === 0) {
            console.log(`No rating found for film ${slug}`);
        } else {
            // look for a class that matches "rated-X" where X is 1-10
            const ratingClass = ratingNode.attr('class').split(' ').find(c => c.startsWith('rated-'));
            rating = ratingClass ? parseInt(ratingClass.split('-')[1]) : null;
        }

        const reviewUrl = viewing.find('a.review-micro').attr('href') || null;

        items.push({
            slug,
            filmId,
            rating,
            posterId,
            reviewUrl,
        });
    });
    return items;
}

const mergeUserRatings = (username, items) => {
    if (!ratingsDb[username]) {
        ratingsDb[username] = { ratings: {}, lastUpdated: null, lastScan: null };
    }

    const user = ratingsDb[username];
    let changed = false;

    for (const film of items) {
        const existing = user.ratings[film.filmId];

        if (!existing) {
            user.ratings[film.filmId] = film;
            changed = true;
            continue;
        }

        if (existing.reviewUrl !== film.reviewUrl || existing.rating !== film.rating) {
            user.ratings[film.filmId] = film;
            changed = true;
        }
    }

    user.lastScan = new Date().toISOString();
    if (changed) {
        user.lastUpdated = new Date().toISOString();
    }
    return changed;
}

const scanUser = async (username, delayMs = 1500) => {
    console.log(`Starting scan for user ${username}`);
    let page = 1;
    let totalChanged = false;

    while (true) {
        console.log(`Fetching page ${page} for user ${username}`);
        const items = await fetchUserPage(username, page);
        if (items.length === 0) {
            console.log(`No more items found for user ${username} on page ${page}`);
            break;
        }

        const changed = mergeUserRatings(username, items);

        if (changed) {
            totalChanged = true;
            saveRatingsDb();
        } else {
            console.log(`No changes found for user ${username} on page ${page}, stopping scan`);
            break;
        }

        page++;
        await sleep(delayMs);
    }

    if (totalChanged) {
        console.log(`Finished scan for user ${username}, changes were made`);
    } else {
        console.log(`Finished scan for user ${username}, no changes were made`);
    }
}

const scanMultipleUsers = async (usernames, delayMs = 2000) => {
    for (const username of usernames) {
        await scanUser(username, delayMs);
        await sleep(delayMs);
    }
}

const getSavedRatings = (username) => {
    if (ratingsDb[username]) {
        return ratingsDb[username].ratings;
    }
    return {};
}

const getSavedRatingsMultiple = (usernames) => {
    const result = {};
    for (const username of usernames) {
        result[username] = getSavedRatings(username);
    }
    return result;
}

scanMultipleUsers(['aquasine', 'ovengoats']).then(() => {
    console.log('Finished scanning all users');
});

app.use(cors());
app.use(express.json());

app.get('/api/search', async (req, res) => {
    console.log('GET /api/search')
    try {
        const response = await axios.get(
            'https://api.letterboxd.com/api/v0/search',
            {
                params: req.query, // Pass query parameters from the client to the Letterboxd API
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/film/:id', async (req, res) => {
    console.log('GET /api/film/:id')
    try {
        const response = await axios.get(
            `https://api.letterboxd.com/api/v0/film/${req.params.id}`
        );
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/image_proxy', async (req, res) => {
    if (!req.query.url) {
        res.status(400).send('Bad Request');
        return;
    }
    try {
        // check if image is already cached
        const filename = req.query.url.split('/').pop().split('?')[0];
        const cachedImagePath = path.join(cachePath, filename);
        if (fs.existsSync(cachedImagePath)) {
            console.log(`Serving cached image ${filename}`);
            res.set('Content-Type', 'image/jpeg');
            res.set('Cache-Control', 'public, max-age=31536000');
            res.sendFile(cachedImagePath);
            return;
        }
        const response = await axios.get(
            req.query.url,
            {
                responseType: 'arraybuffer',
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            }
        );
        res.set('Content-Type', 'image/jpeg');
        res.set('Cache-Control', 'public, max-age=31536000');
        res.send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/ratings/single/:username', (req, res) => {
    console.log('GET /api/ratings/:username')
    const username = req.params.username;
    const ratings = getSavedRatings(username);
    res.json(ratings);
});

app.get('/api/ratings/multiple', (req, res) => {
    console.log('GET /api/ratings/multiple')
    const usernames = req.query.usernames ? req.query.usernames.split(',') : [];
    res.json(getSavedRatingsMultiple(usernames));
});

app.post('/api/scan/multiple', async (req, res) => {
    console.log('GET /api/scan/multiple')
    const usernames = req.body.usernames ? req.body.usernames.split(',') : [];
    if (usernames.length === 0) {
        res.status(400).send('Bad Request: No usernames provided');
        return;
    }
    await scanMultipleUsers(usernames);
    res.json(getSavedRatingsMultiple(usernames));
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Proxy server listening at http://localhost:${port}`);
    fetchAndSaveImages().then(() => {
        console.log('Images fetched and saved');
    });
});