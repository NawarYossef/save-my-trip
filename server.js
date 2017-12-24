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




app.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}`);
})

module.exports = {app};