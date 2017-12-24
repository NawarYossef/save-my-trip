const chai = require("chai");
const chaiHttp = require('chai-http');
const app = require("../server")
const should = chai.should();

chai.use(chaiHttp);

describe("GET endpoint", function() {
  it('should return status 200 and send HTML file for landing page', function(done) { // <= Pass in done callback
    chai.request('http://localhost:8080')
    .get('/')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.html;
      done();                               // <= Call done to signal callback end
    });
  })

  it('should return status 200 and send dashboard page', function(done) { // <= Pass in done callback
    chai.request('http://localhost:8080')
    .get('/dashboard')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.html;
      done();                               // <= Call done to signal callback end
    });
  })

  it('should return status 200 and send new-trip page', function(done) { // <= Pass in done callback
    chai.request('http://localhost:8080')
    .get('/')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.html;
      done();                               // <= Call done to signal callback end
    });
  })
})

