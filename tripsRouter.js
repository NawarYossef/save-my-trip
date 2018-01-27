"use strict"
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {SENDGRID_API_KEY} = require("./config");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);

const {Trip} = require('./models');

// ============== GET endpoint ==============
router.get('/', (req, res) => {
Trip
  .find()
  // call the `.serialize` instance method we've created in
  // models.js in order to only expose the data we want the API return.
  .then(trips => {
    res.json({
      trips: trips.map(trip => trip.serialize())
    });
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  });
});

router.get('/:id', (req, res) => {
  Trip
    .findById(req.params.id)
    .then(trip => res.json(trip.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went horribly awry'});
    });
});



// ============== Email POST endpoint ==============
router.post('/email/:id', (req, res) => {
  Trip
    .findById(req.params.id)
    .then(trip => {
      const msg = {
        to: "nawaryossef2@gmail.com",
        // from: req.user.email,
        from: "nawaryossef2@gmail.com",
        subject: 'Sending with SendGrid is Fun',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      sgMail.send(msg);  
      res.json({trip, message: "Email sent"})
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went horribly awry'});
    }); 
})

// ============== POST endpoint ==============
router.post('/', (req, res) => {
  const requiredFields = [
    "airline", "confirmationCode", 'departure', "arrival",
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
      departure: req.body.departure,
      arrival: req.body.arrival
    })
    .then(trip => res.status(201).json(trip.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
});

// ============== PUT endpoint ==============
router.put('/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }
  
  const updated = {};
  const updateableFields = [
    "airline", "confirmationCode", 'departure', "arrival",
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

// ============== DELETE endpoint ==============
router.delete('/:id', (req, res) => {
  Trip
    .findByIdAndRemove(req.params.id)
    .then(trip => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

module.exports = router;

