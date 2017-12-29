const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {Trip} = require('./models');


router.get('/', (req, res) => {
  Trip
  .find()
  .then(trips => {
    res.json({
      trips: trips.map( trip => trip.serialize() )
    });
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  });
});


router.post('/', (req, res) => {
  const requiredFields = [
    "airline", "confirmationCode", 'tripComments', 'departure', "arrival",
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
    confirmationCode: req.body.confirmationCode,
    tripComments: req.body.tripComments,
    departure: req.body.departure,
    arrival: req.body.arrival
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
    "airline", "confirmationCode", 'tripComments', 'departure', "arrival",
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


router.delete('/:id', (req, res) => {
  Trip
  .findByIdAndRemove(req.params.id)
  .then(trip => res.status(204).end())
  .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

module.exports = router;
