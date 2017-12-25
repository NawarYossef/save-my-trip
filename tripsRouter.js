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

// router.get('/trips', (req, res) => {
//   Trip
//     .find()
//     // we're limiting because restaurants db has > 25,000
//     // documents, and that's too much to process/return
//     .limit(10)
//     // success callback: for each restaurant we got back, we'll
//     // call the `.serialize` instance method we've created in
//     // models.js in order to only expose the data we want the API return.
//     .then(trips => {
//       res.json({
//         trips: trips.map(
//           (trip) => trip.serialize())
//       });
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({ message: 'Internal server error' });
//     });
// });

module.exports = router;