// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const https = require('https');

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
                httpsAgent: new https.Agent({rejectUnauthorized: false})
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

fetchAndSaveImages().then(() => {
    console.log('Images fetched and saved');
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
                httpsAgent: new https.Agent({rejectUnauthorized: false})
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

app.listen(port, '0.0.0.0', () => {
    console.log(`Proxy server listening at http://localhost:${port}`);
});