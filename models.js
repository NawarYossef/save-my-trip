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
    originAirportName: this.originAirportName,
    originAirlines: this.originAirlines,
    originTerminalName: this.originTerminalName,
    originConfirmationNumber: this.originConfirmationNumber,
    originDepartureDateAndTime: this.originDepartureDateAndTime,
    originTransportation: this.originTransportation,
    destinationAirportName: this.destinationAirportName,
    destinationTerminalName: this.destinationTerminalName,
    destinationConfirmationNumber: this.destinationConfirmationNumber,
    destinationArrivalDateAndTime: this.destinationDepartureDateAndTime,
    destinationTransportation: this.destinationTransportation,
    comments: this.comments
  };
}

const Trip = mongoose.model('Trip', TripSchema);
module.exports = {Trip};


