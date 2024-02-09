const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

let cookieUrls = [];

// Load initial cookie URLs from file
try {
    const data = fs.readFileSync('dstryr_state.json', 'utf8');
    const jsonData = JSON.parse(data);
    cookieUrls = jsonData.cookieUrls;
} catch (err) {
    console.error('Error reading file:', err);
}

// Middleware to log requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Get all cookie URLs
app.get('/cookieUrls', (req, res) => {
    res.json(cookieUrls);
});

// Add a new cookie URL
app.post('/cookieUrl', (req, res) => {
    const newUrl = req.body.url;
    cookieUrls.push(newUrl);
    saveDataToFile();
    res.status(201).send('Cookie URL added successfully');
});

// Delete a cookie URL
app.delete('/cookieUrl/:index', (req, res) => {
    const index = req.params.index;
    if (index >= 0 && index < cookieUrls.length) {
        cookieUrls.splice(index, 1);
        saveDataToFile();
        res.send('Cookie URL deleted successfully');
    } else {
        res.status(400).send('Invalid index');
    }
});

// Clear dstryr_state.json content
app.delete('/data', (req, res) => {
    fs.writeFile('dstryr_state.json', JSON.stringify({ cookieUrls: [] }), (err) => {
        if (err) {
            console.error('Error clearing file:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send('Content cleared successfully');
        }
    });
});

// Save data to file
function saveDataToFile() {
    fs.writeFile('dstryr_state.json', JSON.stringify({ cookieUrls }), (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        }
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});