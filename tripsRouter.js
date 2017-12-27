const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Trip} = require('./models');


// ============== test requests ==============
router.get('/json', (req, res) => {
Trip
  .find()
  // we're limiting because restaurants db has > 25,000
  // documents, and that's too much to process/return

  // success callback: for each restaurant we got back, we'll
  // call the `.serialize` instance method we've created in
  // models.js in order to only expose the data we want the API return.
  .then(trips => {
    res.json({
      trips: trips.map(
        (trip) => trip.serialize())
    });
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  });
});

router.post('/new', (req, res) => {
  const requiredFields = [
    "airline", "confirmationCode", 'tripComments', 'departureAirport', "departureDate",
    "departureTransportation", "arrivalAirport", "arrivalDate", "arrivalTransportation"
  ];

  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Trip
    .create({
      airline: req.body.airline,
      originAirlines: req.body.originAirlines,
      confirmationCode: req.body.confirmationCode,
      tripComments: req.body.tripComments,
      departureAirport: req.body.departureAirport,
      departureDate: req.body.departureDate,
      departureTransportation: req.body.departureTransportation,
      arrivalAirport: req.body.arrivalAirport,
      arrivalDate: req.body.arrivalDate,
      arrivalTransportation: req.body.arrivalTransportation
    })
    .then(trip => res.status(201).json(trip.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
});


router.put('/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }
  
  const updated = {};
  const updateableFields = [
    "airline", "confirmationCode", 'tripComments', 'departureAirport', "departureDate",
    "departureTransportation", "arrivalAirport", "arrivalDate", "arrivalTransportation"
  ];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Trip
    .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
    .then(updatedTrip => res.status(204).json(updatedTrip.serialize()))
    .catch(err => res.status(500).json({message: 'Something went wrong'}));
});


router.delete('/delete/:id', (req, res) => {
  Trip
    .findByIdAndRemove(req.params.id)
    .then(trip => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

module.exports = router;