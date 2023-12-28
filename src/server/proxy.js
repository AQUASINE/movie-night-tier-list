// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000; // You can choose any available port

app.use(cors());
app.use(express.json());

app.get('/api/search', async (req, res) => {
    console.log('GET /api/search')
    console.log(req.query)
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

app.listen(port, () => {
    console.log(`Proxy server listening at http://localhost:${port}`);
});