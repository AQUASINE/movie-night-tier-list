// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const https = require('https');

const app = express();
const port = 3008; // You can choose any available port

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

app.get('/image_proxy', async (req, res) => {
    if (!req.query.url) {
        res.status(400).send('Bad Request');
        return;
    }
    try {
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