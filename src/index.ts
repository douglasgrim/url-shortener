import express from 'express';
import { nanoid } from 'nanoid';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Necessary for "__dirname is not defined in es module scope"
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const HOST = process.env.HOST || 'http://localhost';
const PORT = process.env.PORT || 3000;


const urlBitlyMap = new Map<string,string>();
const bitlyUrlMap = new Map<string,string>();

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to enable CORS for frontend communication
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins for simplicity in development
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Serve static files from the 'public' directory (where your HTML will be)
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to shorten a URL 
app.post('/shorten', (req: express.Request, res: express.Response) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'url is required' });
    }

    // Basic URL validation (you might want a more robust validator)
    try {
        new URL(url);
    } catch (e) {
        return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Check if the URL has already been shortened
    if (urlBitlyMap.has(url)) {
        const existingShortCode = urlBitlyMap.get(url);
        return res.json({ shortCode: existingShortCode, short_url: `${req.protocol}://${req.get('host')}/${existingShortCode}` });
    }

    let shortCode: string;
    // Generate a unique short code
    do {
        shortCode = nanoid(7); // Generates a 7-character unique ID
    } while (bitlyUrlMap.has(shortCode));

    bitlyUrlMap.set(shortCode, url);
    urlBitlyMap.set(url, shortCode); // to prevent duplicate entries. This would be handled in a database in a less clunkly method obviously.

    // Construct the full shortened URL
    const short_url = `${req.protocol}://${req.get('host')}/${shortCode}`;

    res.json({ shortCode, short_url });
});

// API endpoint to redirect from a shortened URL
app.get('/:shortCode', (req, res) => {
    const { shortCode } = req.params;
    console.log(shortCode)
    const url = bitlyUrlMap.get(shortCode);

    if (url) {
        // Redirect to the original URL
        res.redirect(302, url);
    } else {
        // If the short code is not found, send a 404 response
        res.status(404).send('URL not found');
    }
});

// API endpoint to list all shortened URLs - using 'api' path here to avoid conflict with short codes
app.get('/api/list-short-codes', (req, res) => {
    const shortCodes = Array.from(bitlyUrlMap).map(([shortCode, url]: [string, string]) => ({ shortCode, url, short_url: `${req.protocol}://${req.get('host')}/${shortCode}` }));
    res.json({ shortCodes });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on ${HOST}:${PORT}`);
});
