const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Trip} = require('./models');

router.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/dreams.html');
});