const bodyParser = require('body-parser');
const express = require("express");
const path = require("path");
const mongoose = require('mongoose');
const morgan = require("morgan")

mongoose.Promise = global.Promise;


const {PORT, DATABASE_URL} = require("./config");
const {Trip} = require("./models")

const app = express();
app.use(bodyParser.json());
app.use(morgan("common"));
app.use(express.static('public'));

app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'public', 'landing-page.html'));
})

app.get("/dashboard", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'public', 'dashboard.html'));
})

app.get("/new-trip", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'public', 'new-trip.html'));
})


// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server 

// this function connects to our database, then starts the server
function startServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, {useMongoClient: true}, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  startServer().catch(err => console.error(err));
}

module.exports = { app, startServer, closeServer };