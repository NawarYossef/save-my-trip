const mongoose = require('mongoose');

const TripSchema = mongoose.Schema({
  origin: [
    {airportName: {type: String, required: true}},
    {terminalName: {type: String, required: false}}, 
    {confirmationNumber: {type: String, required: false}},
    {departureDateAndTime: {type: Date, required: false}},
    {transportation: {type: String, required: true}}
  ],
  destination: [
    {airportName: {type: String, required: true}},
    {terminalName: {type: String, required: false}}, 
    {confirmationNumber: {type: String, required: false}},
    {arrivalDateAndTime: {type: Date, required: false}},
    {transportation: {type: String, required: true}}
  ],
  comments:  {type: String, required: true}
});


TripSchema.methods.serialize = function() {
  return {
    id: this._id,
    originAirportName: this.origin[airportName],
    originTerminalName: this.origin[terminalName],
    originConfirmationNumber: this.origin[confirmationNumber],
    originDepartureDateAndTime: this.origin[departureDateAndTime],
    originTransportation: this.origin[transportation],
    destinationAirportName: this.destination[airportName],
    destinationTerminalName: this.destination[terminalName],
    destinationConfirmationNumber: this.destination[confirmationNumber],
    destinationArrivalDateAndTime: this.destination[departureDateAndTime],
    destinationTransportation: this.destination[transportation],
    comments: this.comments
  };
}

const Trip = mongoose.model('Trip', TripSchema);
module.exports = {Trip};


