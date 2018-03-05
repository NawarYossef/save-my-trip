"use strict"

class EditTrip {
  constructor() {
    this.token = localStorage.getItem("token");
  }

  init() {
    this.getTripData();
    this.initializeDateAndTimePicker();
  }

  getTripData() {
    const tripId = this.getTripId();
    $.ajax({
      url: `/trips/${tripId}`,
      type: "GET",
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    })
      .done(data => {
        this.renderData(data);
        this.submitUpdatedTrip(tripId);
      })
      .fail(data => {
        console.error("something is wrong");
        window.location.replace(`/`);
      });
  }

  getTripId() {
    return window.location.href.substring(
      window.location.href.lastIndexOf("=") + 1
    );
  }

  renderData(data) {
    const trip = data;
    console.log(data);
    $("#airline").val(trip.airline);
    $("#confirmation").val(trip.confirmationCode);

    $("#departure-city").val(trip.departure.city);
    $("#departure-airport").val(trip.departure.airport);
    $("#departure-terminal").val(trip.departure.terminal);
    $("#departure-gate").val(trip.departure.gate);
    $("#datepicker-1").val(helpers.parseDate(trip.departure.date));

    $("#arrival-city").val(trip.arrival.city);
    $("#arrival-airport").val(trip.arrival.airport);
    $("#arrival-terminal").val(trip.arrival.terminal);
    $("#arrival-gate").val(trip.arrival.gate);
    $("#datepicker-2").val(helpers.parseDate(trip.arrival.date));
  }


  submitUpdatedTrip(tripId) {
    $("#new-trip-form").submit(e => {
      e.preventDefault();
      const trip = {
        id: tripId,
        airline: $("#airline").val(),
        confirmationCode: $("#confirmation").val() || '--',
        departure: {
          city: $("#departure-city").val(),
          airport: $("#departure-airport").val(),
          terminal: $("#departure-terminal").val() || '--',
          gate: $("#departure-gate").val() || '--',
          date: $("#datepicker-1").val()
        },
        arrival: {
          city: $("#arrival-city").val(),
          airport: $("#arrival-airport").val(),
          terminal: $("#arrival-terminal").val() || '--',
          gate: $("#arrival-gate").val() || '--',
          date: $("#datepicker-2").val()
        }
      };

      $.ajax({
        type: "PUT",
        url: `/trips/${tripId}`,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(trip),
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
        .done(data => {
          console.log(data);
          // $("#new-trip-form")[0].reset();
          this.changeRouteToTripsPage();
        })
        .fail(data => {
          console.log(data);
          console.error("something is wrong");
          window.location.replace(`/`);
        });
    });
  }

  changeRouteToTripsPage() {
    window.location.replace(`/trips.html`);
  }

  initializeDateAndTimePicker() {
    $("#datepicker-1, #datepicker-2").flatpickr({
      altInput: false,
      minDate: "today",
      dateFormat: "m d, Y"
    });
  }
}

const app = new EditTrip();
app.init();
