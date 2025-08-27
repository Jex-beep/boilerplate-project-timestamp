// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// =========================
// Timestamp API Endpoint
// =========================
app.get("/api/:date?", (req, res) => {
  let dateString = req.params.date;

  // If no date is provided → current date
  if (!dateString) {
    let now = new Date();
    return res.json({
      unix: Math.floor(now.getTime() / 1000),
      utc: now.toUTCString(),
    });
  }

  // If input is numbers → treat as unix timestamp
  if (/^\d+$/.test(dateString)) {
    let timestamp = parseInt(dateString);

    // If it's in seconds (10 digits) → convert to ms
    if (dateString.length === 10) {
      timestamp *= 1000;
    }

    let date = new Date(timestamp);
    return res.json({
      unix: Math.floor(date.getTime() / 1000),
      utc: date.toUTCString(),
    });
  }

  // Otherwise → try parsing as a date string
  let date = new Date(dateString);
  if (date.toString() === "Invalid Date") {
    return res.json({ error: "Invalid Date" });
  }

  return res.json({
    unix: Math.floor(date.getTime() / 1000),
    utc: date.toUTCString(),
  });
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
// hey