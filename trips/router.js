"use strict";
const express = require("express");
const passport = require("passport");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const legit = require("legit");

const { SENDGRID_API_KEY } = require("../config");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(SENDGRID_API_KEY);

const { Trip } = require("./model");
const jwtAuth = passport.authenticate("jwt", { session: false });

router.use(jsonParser);
// ============== GET endpoint ==============
router.get("/", jwtAuth, (req, res) => {
  Trip.find({ user: req.user.id })
    // call the `.serialize` instance method we've created in
    // models.js in order to only expose the data we want the API return.
    .then(trips => {
      res.json({
        trips: trips.map(trip => trip.serialize())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

router.get("/:id", jwtAuth, (req, res) => {
  Trip.findById(req.params.id)
    .then(trip => res.json(trip.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "something went horribly awry" });
    });
});

// ============== Email POST endpoint ==============
router.post("/email/:id", jwtAuth, (req, res) => {
  legit(req.body.email, function(err, validation, addresses) {
    if (validation == false) {
      res.status(500).json({ error: "Invalid Email. Please try again" });
    } else {
      Trip.findById(req.params.id)
        .then(trip => {
          const msg = {
            from: req.user.email,
            to: req.body.email,
            subject: `${JSON.stringify(req.body.title)}`,
            text: "Hey Hey Hey ",
            html: `<div>
                  <h4>${JSON.stringify(req.body.message)}</h4>
                  <h2>Trip Information</h2><br>
                  <h3>Origin</h3>
                  <p><strong>City: </strong>${trip.departure.city}</p>
                  <p><strong>Terminal: </strong>${trip.departure.terminal}</p>
                  <p><strong>Gate: </strong>${trip.departure.gate}</p>
                  <p><strong>Departure-date and Time: </strong>${trip.formattedDate(
                    trip.departure.date
                  )}</p>
                  <hr >
                  <h3>Destination</h3>
                  <p><strong>City: </strong>${trip.arrival.city}</p>
                  <p><strong>Terminal: </strong>${trip.arrival.terminal}</p>
                  <p><strong>Gate: </strong>${trip.arrival.gate}</p>
                  <p><strong>Confirmation-code: </strong>${
                    trip.confirmationCode
                  }</p>
                  <p><strong>Airlines: </strong>${trip.airline}</p>
                  <p><strong>Arrival-date and Time: </strong>${trip.formattedDate(
                    trip.arrival.date
                  )}</p><br>
                </div>`
          };
          sgMail.send(msg);
          res.json({ trip, message: "Email sent" });
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ error: "something went horribly awry" });
        });
    }
  });
});

// ============== POST endpoint ==============
router.post("/", jwtAuth, (req, res) => {
  const requiredFields = [
    "airline",
    "confirmationCode",
    "departure",
    "arrival"
  ];

  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Trip.create({
    airline: req.body.airline,
    confirmationCode: req.body.confirmationCode,
    departure: req.body.departure,
    arrival: req.body.arrival,
    user: req.user.id
  })
    .then(trip => res.status(201).json(trip.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
});

// ============== PUT endpoint ==============
router.put("/:id", jwtAuth, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: "Request path id and request body id values must match"
    });
  }

  const updated = {};
  const updateableFields = [
    "airline",
    "confirmationCode",
    "departure",
    "arrival"
  ];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Trip.findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedTrip => res.status(204).json(updatedTrip.serialize()))
    .catch(err => res.status(500).json({ message: "Something went wrong" }));
});

// ============== DELETE endpoint ==============
router.delete("/:id", jwtAuth, (req, res) => {
  Trip.findByIdAndRemove(req.params.id)
    .then(trip => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});

module.exports = { router };
