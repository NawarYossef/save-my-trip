const express = require('express');
const router = express.Router();
const path = require("path");
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Trip} = require('./models');

router.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'public', 'trips.html'));
})

router.get("/new-trip", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'public', 'new-trip.html'));
})

module.exports = router;