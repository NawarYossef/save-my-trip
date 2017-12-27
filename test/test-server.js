const chai = require("chai");
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require("../server")
const should = chai.should();
const {TEST_DATABASE_URL} = require("../config")
const {Trip} = require("../models")

chai.use(chaiHttp);

describe('Trips API resource', function() {
  before(function() {
  // Before the tests run, the server is activated. the`runServer`
  // function returns a promise, and that promise is returned by
  // doing `return runServer`. Without returning a promise here,
  // there's a possibility of a race condition where our tests start
  // running before our server has started.
    return runServer(TEST_DATABASE_URL);
  });


  // close server at the end of these tests. Otherwise,
  // if another test module is added that also has a `before` block
  // and starts the server, it will cause an error because the
  // server would still be running from the previous tests.
  after(function() {
    return closeServer();
  });

  // tests for GET endpoint
  describe("GET endpoint", function() {
    it('should return status 200 and send HTML file for landing page', function(done) { // <= Pass in done callback
      chai.request(app)
      .get('/')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done();                               // <= Call done to signal callback end
      });
    })
  
    it('should return status 200 and send trips page', function(done) { // <= Pass in done callback
      chai.request(app)
      .get('/trips.html')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done();                               // <= Call done to signal callback end
      });
    })
  
    it('should return status 200 and send new-trip page', function(done) { // <= Pass in done callback
      chai.request(app)
      .get('/new-trip.html')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done();                               // <= Call done to signal callback end
      });
    })
  
    it('should list items on GET', function(done) {
      // for Mocha tests, when dealing with asynchronous operations,
      // a Promise object must be returned or else call a `done` callback
      // at the end of the test. The `chai.request(server).get...` call is asynchronous
      // and returns a Promise, so it must be returned.
      chai.request(app)
      .get('/trips/json')
      .then(function(res) {
        // console.log(res.body)
        res.should.have.status(200);
        done()
    })
  })

  // tests for POST endpoint
  describe("POST endpoint", function() {
    it("should add a new trip", function(done) {
      const newTrip = {
        "airline":"Delta",
        "confirmationCode":"1234565",
        "tripComments": "going to hotel after arrival",
        "departureAirport": "ATL",
        "departureDate": "Mon Dec 04 2017 00:00:00 GMT-0500 (Eastern Standard Time)",
        "departureTransportation": "by bus",
        "arrivalAirport": "NYC",
        "arrivalDate": "Wed Dec 20 2017 00:00:00 GMT-0500 (Eastern Standard Time)",
        "arrivalTransportation": "by taxi"
      }
  
      chai.request(app)
      .post("/trips/new")
      .send(newTrip)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json
        res.should.be.an('object');
        res.body.should.include.keys(
          "airline", "confirmationCode", 'tripComments', 'departureAirport', "departureDate",
          "departureTransportation", "arrivalAirport", "arrivalDate", "arrivalTransportation" 
        );
        // Mongo should have created id on insertion
        res.body.id.should.not.be.null;
        res.body.airline.should.equal(newTrip.airline);
        res.body.confirmationCode.should.equal(newTrip.confirmationCode);
        res.body.tripComments.should.equal(newTrip.tripComments);
        res.body.departureAirport.should.equal(newTrip.departureAirport);
        res.body.departureDate.should.equal(newTrip.departureDate);
        res.body.departureTransportation.should.equal(newTrip.departureTransportation);
        res.body.arrivalAirport.should.equal(newTrip.arrivalAirport);
        res.body.arrivalDate.should.equal(newTrip.arrivalDate);
        res.body.arrivalTransportation.should.equal(newTrip.arrivalTransportation);
        return Trip.findById(res.body.id);
        })
        .then(function(Trip) {
          Trip.airline.should.equal(newTrip.airline);
          Trip.confirmationCode.should.equal(newTrip.confirmationCode);
          Trip.tripComments.should.equal(newTrip.tripComments);
          Trip.departureAirport.should.equal(newTrip.departureAirport);
          Trip.departureDate.should.equal(newTrip.departureDate);
          Trip.departureTransportation.should.equal(newTrip.departureTransportation);
          Trip.arrivalAirport.should.equal(newTrip.arrivalAirport);
          Trip.arrivalDate.should.equal(newTrip.arrivalDate);
          Trip.arrivalTransportation.should.equal(newTrip.arrivalTransportation);
        });
        done();
      })
    })
  })
  
  //test for PUT endpoint
  describe('PUT endpoint', function() {
    // strategy:
    //  1. Get an existing restaurant from db
    //  2. Make a PUT request to update that restaurant
    //  3. Prove restaurant returned by request contains data we sent
    //  4. Prove restaurant in db is correctly updated
    it('should update fields you send over', function(done) {
      const updateData = {
        airline: 'Delta',
        arrivalAirport: 'NYC',
        arrivalTransportation: "Bus"
      };

      Trip
        .findOne()
        .then(function(trip) {
          updateData.id = trip.id;

          // make request then inspect it to make sure it reflects
          // data we sent
          chai.request(app)
          .put(`/trips/${trip.id}`)
          .send(updateData);
        })
        .then(function(res) {
          res.should.have.status(204);

          Trip.findById(updateData.id);
        })
        .then(function(trip) {
          trip.airline.should.equal(updateData.airline);
          trip.arrivalAirport.should.equal(updateData.arrivalAirport);
          trip.arrivalTransportation.should.equal(updateData.arrivalTransportation);
        });
      done();
    });
  });

  //test for DELETE endpoint
  describe('DELETE endpoint', function() {
    // strategy:
    //  1. get a restaurant
    //  2. make a DELETE request for that restaurant's id
    //  3. assert that response has right status code
    //  4. prove that restaurant with the id doesn't exist in db anymore
    it('delete a trip by id', function(done) {

      let trip;

      Trip
        .findOne()
        .then(function(_trip) {
          trip = _trip;
          chai.request(app).delete(`/trips/delete/${trip.id}`);
        })
        .then(function(res) {
          res.should.have.status(204);
          Trip.findById(trip.id);
        })
        .then(function(_restaurant) {
          // when a variable's value is null, chaining `should`
          // doesn't work. so `_restaurant.should.be.null` would raise
          // an error. `should.be.null(_restaurant)` is how
          // assertions can be made about a null value.
          should.not.exist(_trip);
        });
      done()
    });
  });
})
  

