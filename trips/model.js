const mongoose = require("mongoose");

const TripSchema = mongoose.Schema({
  airline: { type: String, required: true },
  confirmationCode: { type: String, required: false, unique: true },
  departure: {
    city: { type: String, required: true },
    airport: { type: String, required: true },
    terminal: { type: String, required: false },
    gate: { type: String, required: false },
    date: { type: Date, required: true }
  },
  arrival: {
    city: { type: String, required: true },
    airport: { type: String, required: true },
    terminal: { type: String, required: false },
    gate: { type: String, required: false },
    date: { type: Date, required: true }
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

TripSchema.methods.serialize = function() {
  return {
    id: this._id,
    airline: this.airline,
    confirmationCode: this.confirmationCode,
    departure: {
      city: this.departure.city,
      airport: this.departure.airport,
      terminal: this.departure.terminal,
      gate: this.departure.gate,
      date: this.departure.date
    },
    arrival: {
      city: this.arrival.city,
      airport: this.arrival.airport,
      terminal: this.arrival.terminal,
      gate: this.arrival.gate,
      date: this.arrival.date
    }
  };
};

const Trip = mongoose.model("Trip", TripSchema);
module.exports = { Trip };
