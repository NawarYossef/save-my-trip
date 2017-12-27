const mongoose = require('mongoose');

const TripSchema = mongoose.Schema({
  airline: {type: String, required: true},
  confirmationCode: {type: String, required: false},
  tripComments:  {type: String, required: false},

  departure: {
    airport: {type: String, required: true},
    date: {type: Date, required: true},
    transportation: {type: String, required: false},
  },
  arrival: {
    airport: {type: String, required: true},
    date: {type: Date, required: false},
    transportation: {type: String, required: false},
  }
});


TripSchema.methods.serialize = function() {
  return {
    id: this._id,
    airline: this.airline,
    confirmationCode: this.confirmationCode,
    tripComments: this.tripComments,

    departureAirport: this.departure.airport,
    departureDate: this.departure.date,
    departureTransportation: this.departure.transportation,

    arrivalAirport: this.arrival.airport,
    arrivalDate: this.arrival.date,
    arrivalTransportation: this.arrival.transportation
  };
}

const Trip = mongoose.model('Trip', TripSchema);
module.exports = {Trip};


