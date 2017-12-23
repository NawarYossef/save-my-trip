const chai = require("chai");
const chaiHttp = require('chai-http');
const app = require("../server")
const should = chai.should();

chai.use(chaiHttp);

describe("GET request", function() {
  it('return status 200', function() { // <= Pass in done callback
    chai.request(app)
    .get('/')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.html;
      done();                               // <= Call done to signal callback end
    });
  })
})

