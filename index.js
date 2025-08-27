// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});

// =========================
// Timestamp API Endpoint
// =========================
app.get("/api/:date?", (req, res) => {
  const dateParam = req.params.date;

  let date;

  // Case 1: No date provided → current date
  if (!dateParam) {
    date = new Date();
  }
  // Case 2: Numeric input → treat as timestamp
  else if (/^\d+$/.test(dateParam)) {
    let ms = Number(dateParam);

    // If input is seconds (10 digits) → convert to ms
    if (dateParam.length === 10) {
      ms = ms * 1000;
    }

    date = new Date(ms);
  }
  // Case 3: Date string
  else {
    date = new Date(dateParam);
  }

  // Invalid date check
  if (date.toString() === "Invalid Date") {
    return res.json({ error: "Invalid Date" });
  }

  // Valid date response
  return res.json({
    unix: date.getTime(),      // milliseconds (✅ FCC expects this)
    utc: date.toUTCString(),   // correct UTC format
  });
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
