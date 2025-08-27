// Timestamp Microservice - server.js
// Node + Express implementation that satisfies FreeCodeCamp Timestamp Microservice tests.
// To use:
// 1. Create folder, put this file as server.js
// 2. npm init -y
// 3. npm install express cors
// 4. Start: node server.js (or set PORT env var for deployment)

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('public'));

// Root -- optional: serves a simple message (you can replace with your index.html)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// API endpoint
app.get('/api/:date?', (req, res) => {
  const { date } = req.params;

  // If no date param, return current time
  if (!date) {
    const now = new Date();
    return res.json({ unix: now.getTime(), utc: now.toUTCString() });
  }

  // If date consists only of digits, treat as milliseconds timestamp
  // (Some test harnesses provide a numeric string like "1451001600000")
  const onlyDigits = /^\d+$/;

  let dateObj;
  if (onlyDigits.test(date)) {
    // parse as integer (milliseconds)
    const parsed = Number(date);
    dateObj = new Date(parsed);
  } else {
    // parse as date string
    dateObj = new Date(date);
  }

  // Validate
  if (dateObj.toString() === 'Invalid Date') {
    return res.json({ error: 'Invalid Date' });
  }

  res.json({ unix: dateObj.getTime(), utc: dateObj.toUTCString() });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Timestamp Microservice listening on port ${port}`);
});

/*
Optional package.json (if you want to copy/paste):
{
  "name": "timestamp-microservice",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2"
  }
}

Notes / Edge cases handled:
- Numeric-only input is treated as milliseconds (as required by the tests). Example: /api/1451001600000
- ISO date strings (e.g. 2015-12-25) are parsed by new Date(date_string).
- Invalid parsed Date responds with { error: "Invalid Date" }.
- No date param returns the current time in both unix (ms) and utc string.

Testing examples:
- GET /api/2015-12-25  => { unix: 1451001600000, utc: "Fri, 25 Dec 2015 00:00:00 GMT" }
- GET /api/1451001600000 => { unix: 1451001600000, utc: "Fri, 25 Dec 2015 00:00:00 GMT" }
- GET /api/foo => { error: "Invalid Date" }
*/
