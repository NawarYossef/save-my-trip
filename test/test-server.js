const chai = require("chai");
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require("../server")
const should = chai.should();
const {TEST_DATABASE_URL} = require("../config")

chai.use(chaiHttp);

describe("GET endpoint", function() {
  before(function() {
  // Before our tests run, we activate the server. Our `runServer`
  // function returns a promise, and we return the that promise by
  // doing `return runServer`. If we didn't return a promise here,
  // there's a possibility of a race condition where our tests start
  // running before our server has started.
    return runServer(TEST_DATABASE_URL);
  });

  // although we only have one test module at the moment, we'll
  // close our server at the end of these tests. Otherwise,
  // if we add another test module that also has a `before` block
  // that starts our server, it will cause an error because the
  // server would still be running from the previous tests.
  after(function() {
    return closeServer();
  });

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
    // for Mocha tests, when we're dealing with asynchronous operations,
    // we must either return a Promise object or else call a `done` callback
    // at the end of the test. The `chai.request(server).get...` call is asynchronous
    // and returns a Promise, so we just return it.
    chai.request(app)
      .get('/trips/json')
      .then(function(res) {
        // console.log(res.body)
        res.should.have.status(200);
        done()
      })
  })

})

