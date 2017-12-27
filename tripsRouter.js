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

router.post('/new/json', (req, res) => {
  const requiredFields = [
    "originAirportName", "originAirlines", 'originTerminalName', 'originConfirmationCode', 
    "originDepartureDateAndTime", "originTransportation", "destinationAirportName", "destinationTerminalName",
    "destinationConfirmationNumber", "destinationArrivalDateAndTime"
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
      originAirportName: req.body.originAirportName,
      originAirlines: req.body.originAirlines,
      originTerminalName: req.body.originTerminalName,
      originConfirmationCode: req.body.originConfirmationCode,
      originDepartureDateAndTime: req.body.originDepartureDateAndTime,
      originTransportation: req.body.originTransportation,
      destinationAirportName: req.body.destinationAirportName,
      destinationTerminalName: req.body.destinationTerminalName,
      destinationConfirmationNumber: req.body.destinationConfirmationNumber,
      destinationArrivalDateAndTime: req.body.destinationArrivalDateAndTime
    })
    .then(trip => res.status(201).json(trip.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
});


router.put('/:id/json', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = [
    "originAirportName", "originAirlines", 'originTerminalName', 'originConfirmationCode', 
    "originDepartureDateAndTime", "originTransportation", "destinationAirportName", "destinationTerminalName",
    "destinationConfirmationNumber", "destinationArrivalDateAndTime"
  ];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Trip
    .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
    .exec()
    .then(updatedTrip => res.status(204).json(updatedTrip.apiRepr()))
    .catch(err => res.status(500).json({message: 'Something went wrong'}));
});


module.exports = router;