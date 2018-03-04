const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const should = chai.should();

const { app, runServer, closeServer } = require("../server");
const { TEST_DATABASE_URL } = require("../config");

describe("Server Static Serve", function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });

  it("should return status 200 and serve a HTML page", function(done) {
    // <= Pass in done callback
    chai
      .request(app)
      .get("/")
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done(); // <= Call done to signal callback end
      });
  });

  it("should return status 200 and serve a HTML page", function(done) {
    // <= Pass in done callback
    chai
      .request(app)
      .get("/trips.html")
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done(); // <= Call done to signal callback end
      });
  });

  it("should return status 200 and serve a HTML page", function(done) {
    // <= Pass in done callback
    chai
      .request(app)
      .get("/new-trip.html")
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done(); // <= Call done to signal callback end
      });
  });

  // it("should return status 200 and serve a HTML page", function(done) {
  //   // <= Pass in done callback
  //   chai
  //     .request(app)
  //     .get("/edit-trip.html")
  //     .end(function(err, res) {
  //       res.should.have.status(200);
  //       res.should.be.html;
  //       done(); // <= Call done to signal callback end
  //     });
  // });
});
