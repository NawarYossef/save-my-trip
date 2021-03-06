"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require("faker");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { app, runServer, closeServer } = require("../server");
const { TEST_DATABASE_URL, JWT_SECRET } = require("../config");
const { Trip } = require("../trips/model");
const { User } = require("../users/model");

const username = "exampleUser";
const password = "examplePass";
const email = "exampleUser@examplePass.com";
const firstName = "Example";
const lastName = "User";
let validToken;
let id = "";

// this makes the should syntax available throughout
// this module
const should = chai.should();
chai.use(chaiHttp);

// this function is used to put randomish documents in db
// so that there is data to work with and assert about.
// the Faker library is used to automatically
// generate placeholder values for author, title, content
// and then insert that data into mongo
function seedTripData() {
  console.info("seeding trips data");
  const seedData = [];

  for (let i = 1; i <= 5; i++) {
    seedData.push(generateTripData());
  }

  // this will return a promise
  return Trip.insertMany(seedData);
}

// used to generate data to put in db
function generateAirline() {
  const airline = [
    "JetBlue",
    "Southwest Airlines",
    "United Airlines",
    "Hawaiian Airlines",
    "Delta"
  ];
  return airline[Math.floor(Math.random() * airline.length)];
}

// used to generate data to put in db
function generateAirport() {
  const airport = ["BHM", "LHD", "LHD", "DAB", "LFT"];
  return airport[Math.floor(Math.random() * airport.length)];
}

// generate an object representing a trip.
// can be used to generate seed data for db
// or request.body data
function generateTripData() {
  return {
    airline: generateAirline(),
    confirmationCode: String(faker.random.uuid()),
    departure: {
      city: faker.address.city(),
      airport: generateAirport(),
      terminal: String(faker.random.number()),
      gate: String(faker.random.number()),
      date: parseDate(faker.date.recent())
    },
    arrival: {
      city: faker.address.city(),
      airport: generateAirport(),
      terminal: String(faker.random.number()),
      gate: String(faker.random.number()),
      date: parseDate(faker.date.future())
    },
    user: id
  };
}

function parseDate(data) {
  const month = new Date(data).toString().split(" ")[1];
  const day = new Date(data).toString().split(" ")[2];
  const year = new Date(data).toString().split(" ")[3];
  return month + " " + day + ", " + year;
}

// this function deletes the entire database.
// it will be called in an `afterEach` block below
// to ensure data from one test does not stick
// around for next one
function tearDownDb() {
  console.warn("Deleting database");
  return mongoose.connection.dropDatabase();
}

describe("Trip API resource", function() {
  // each of these hook functions are needed to return a promise
  // otherwise a callback "done" will need to be called.
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return User.hashPassword(password).then(password =>
      User.create({
        username,
        password,
        email,
        firstName,
        lastName
      })
        .then(user => (id = user.id))
        .then(() => {
          validToken = jwt.sign(
            {
              user: {
                username,
                firstName,
                lastName,
                email,
                id
              },
              exp: Math.floor(Date.now() / 1000) + 500 // Expired ten seconds ago
            },
            JWT_SECRET,
            {
              algorithm: "HS256",
              subject: username
            }
          );
          return "";
        })
    );
  });

  beforeEach(function() {
    return seedTripData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe("GET endpoint", function() {
    it("should return all existing trips", function() {
      let res;
      return chai
        .request(app)
        .get("/trips")
        .set("Authorization", `Bearer ${validToken}`)
        .then(function(_res) {
          // so subsequent .then blocks can access res obj.
          res = _res;
          res.should.have.status(200);
          // otherwise the db seeding didn't work
          res.body.trips.should.have.length.of.at.least(1);
          return Trip.count();
        })
        .then(function(count) {
          res.body.trips.should.have.length.of(count);
        });
    });

    it("should return trips with right fields", function() {
      // Get back all trips, and ensure they have expected keys

      let resTrip;
      return chai
        .request(app)
        .get("/trips")
        .set("Authorization", `Bearer ${validToken}`)
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.trips.should.be.a("array");
          res.body.trips.should.have.length.of.at.least(1);

          res.body.trips.forEach(function(trip) {
            trip.should.be.a("object");
            trip.should.include.keys(
              "airline",
              "confirmationCode",
              "departure",
              "arrival"
            );
          });
          resTrip = res.body.trips[0];
          return Trip.findById(resTrip.id);
        })
        .then(function(trip) {
          //strategy:
          // use dates to create two instances of the Date object.
          //  call 'getMilliseconds() to compare both values'

          let tripDepartureDate = new Date(
            `${trip.departure.date}`
          ).getMilliseconds();
          let resTripDepartureDate = new Date(
            `${resTrip.departure.date}`
          ).getMilliseconds();

          let tripArrivalDate = new Date(
            `${trip.arrival.date}`
          ).getMilliseconds();
          let resTripArrivalDate = new Date(
            `${resTrip.arrival.date}`
          ).getMilliseconds();
          resTrip.departure.city.should.equal(trip.departure.city);
          resTrip.departure.airport.should.equal(trip.departure.airport);
          resTrip.departure.terminal.should.equal(trip.departure.terminal);
          resTrip.departure.gate.should.equal(trip.departure.gate);
          resTripDepartureDate.should.equal(tripDepartureDate);

          resTrip.arrival.city.should.equal(trip.arrival.city);
          resTrip.arrival.airport.should.equal(trip.arrival.airport);
          resTrip.arrival.terminal.should.equal(trip.arrival.terminal);
          resTrip.arrival.gate.should.equal(trip.arrival.gate);
          resTripArrivalDate.should.equal(tripArrivalDate);
        });
    });
  });

  describe("POST endpoint", function() {
    // make a POST request with data,
    // then prove that the trip you get back has
    // right keys, and that `id` is there (which means
    // the data was inserted into db)
    it("should add a new trip", function() {
      const newTrip = generateTripData();

      return chai
        .request(app)
        .post("/trips")
        .set("Authorization", `Bearer ${validToken}`)
        .send(newTrip)
        .then(function(res) {
          //strategy:
          // use dates to create two instances of the Date object.
          //  call 'getMilliseconds() to compare both values'
          let tripDepartureDate = new Date(
            `${newTrip.departure.date}`
          ).getMilliseconds();
          let resDepartureDate = new Date(
            `${res.body.departure.date}`
          ).getMilliseconds();

          let tripArrivalDate = new Date(
            `${newTrip.arrival.date}`
          ).getMilliseconds();
          let resArrivalDate = new Date(
            `${res.body.arrival.date}`
          ).getMilliseconds();

          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.include.keys(
            "airline",
            "confirmationCode",
            "departure",
            "arrival"
          );
          res.body.airline.should.equal(newTrip.airline);
          res.body.confirmationCode.should.equal(newTrip.confirmationCode);

          res.body.departure.city.should.equal(newTrip.departure.city);
          res.body.departure.airport.should.equal(newTrip.departure.airport);
          res.body.departure.terminal.should.equal(newTrip.departure.terminal);
          res.body.departure.gate.should.equal(newTrip.departure.gate);
          resDepartureDate.should.equal(tripDepartureDate);

          res.body.arrival.city.should.equal(newTrip.arrival.city);
          res.body.arrival.airport.should.equal(newTrip.arrival.airport);
          res.body.arrival.terminal.should.equal(newTrip.arrival.terminal);
          res.body.arrival.gate.should.equal(newTrip.arrival.gate);
          resArrivalDate.should.equal(tripArrivalDate);

          return Trip.findById(res.body.id);
        })
        .then(function(trip) {
          //strategy:
          // use dates to create two instances of the Date object.
          //  call 'getMilliseconds() to compare both values'
          let tripDepartureDate = new Date(
            `${newTrip.departure.date}`
          ).getMilliseconds();
          let resDepartureDate = new Date(
            `${trip.departure.date}`
          ).getMilliseconds();

          let tripArrivalDate = new Date(
            `${newTrip.arrival.date}`
          ).getMilliseconds();
          let resArrivalDate = new Date(
            `${trip.arrival.date}`
          ).getMilliseconds();

          trip.airline.should.equal(newTrip.airline);
          trip.confirmationCode.should.equal(newTrip.confirmationCode);

          trip.departure.city.should.equal(newTrip.departure.city);
          trip.departure.airport.should.equal(newTrip.departure.airport);
          trip.departure.terminal.should.equal(newTrip.departure.terminal);
          trip.departure.gate.should.equal(newTrip.departure.gate);
          tripDepartureDate.should.equal(resDepartureDate);

          trip.arrival.city.should.equal(newTrip.arrival.city);
          trip.arrival.airport.should.equal(newTrip.arrival.airport);
          trip.arrival.terminal.should.equal(newTrip.arrival.terminal);
          trip.arrival.gate.should.equal(newTrip.arrival.gate);
          tripArrivalDate.should.equal(resArrivalDate);
        });
    });
  });

  describe("PUT endpoint", function() {
    // strategy:
    //  1. Get an existing trip from db
    //  2. Make a PUT request to update that trip
    //  3. Prove trip returned by request contains data we sent
    //  4. Prove trip in db is correctly updated
    it("should update fields sent over", function() {
      const updateData = {
        departure: {
          airport: "xxx"
        },
        confirmationCode: "1111111"
      };

      return Trip.findOne()
        .then(function(trip) {
          updateData.id = trip.id;

          // make request then inspect it to make sure it reflects
          // the data ent
          return chai
            .request(app)
            .put(`/trips/${trip.id}`)
            .set("Authorization", `Bearer ${validToken}`)
            .send(updateData);
        })
        .then(function(res) {
          res.should.have.status(204);

          return Trip.findById(updateData.id);
        })
        .then(function(trip) {
          trip.departure.airport.should.equal(updateData.departure.airport);
          trip.confirmationCode.should.equal(updateData.confirmationCode);
        });
    });
  });

  describe("DELETE endpoint", function() {
    // strategy:
    //  1. get a trip
    //  2. make a DELETE request for that trip's id
    //  3. assert that response has right status code
    //  4. prove that trip with the id doesn't exist in db anymore
    it("delete a trip by id", function() {
      let trip;

      return Trip.findOne()
        .then(function(_trip) {
          trip = _trip;
          return chai
            .request(app)
            .delete(`/trips/${trip.id}`)
            .set("Authorization", `Bearer ${validToken}`);
        })
        .then(function(res) {
          res.should.have.status(204);
          return Trip.findById(trip.id);
        })
        .then(function(_trip) {
          // when a variable's value is null, chaining `should`
          // doesn't work. so `_trip.should.be.null` would raise
          // an error. `should.be.null(_trip)` is a assertions is made
          // about a null value.
          should.not.exist(_trip);
        });
    });
  });
});
