const mongoose = require('mongoose');

const TripSchema = mongoose.Schema({
  originAirportName: {type: String, required: true},
  originTerminalName: {type: String, required: false}, 
  originConfirmationNumber: {type: String, required: false},
  originDepartureDateAndTime: {type: Date, required: false},
  originTransportation: {type: String, required: true},

  destinationAirportName: {type: String, required: true},
  destinationTerminalName: {type: String, required: false}, 
  destinationConfirmationNumber: {type: String, required: false},
  destinationArrivalDateAndTime: {type: Date, required: false},
  destinationTransportation: {type: String, required: true},
  comments:  {type: String, required: true}
});


TripSchema.methods.serialize = function() {
  return {
    id: this._id,
    originAirportName: this.originAirportName,
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

