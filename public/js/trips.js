"use strict";
console.log(334);

class Trips  {

  init() {
    this.getTripEntries();
    this.toggleHamburger();
    this.setToggleListener();
  }

  getTripEntries() {
    $.ajax({
      url: "http://localhost:8081/trips",
      type: 'GET',
      success: (data) => {
        console.log(data)
        this.renderTrips(data);
      }
    });
  }

  renderTrips(data) {
    const allTrips = data.trips.map(trip => {

      const tripHTML = $("#example-trip").clone();
      tripHTML.removeClass("hidden")
      tripHTML.attr("id", trip.id);
      // tripHTML.find(".confirmation-text").text(trip.confirmationCode);
      this.validateConfirmationCode(tripHTML, trip)
      tripHTML.find(".depart-airport").text(trip.departure.airport);
      tripHTML.find(".arrive-airport").text(trip.arrival.airport);
      tripHTML.find("h4").text(trip.arrival.date);
      tripHTML.find(".airline-text").text(trip.airline);
      
      tripHTML.find(".depart-date-text").text(trip.departure.date);
      tripHTML.find(".city").text(trip.departure.city);
      tripHTML.find(".terminal").text(`Terminal: ${trip.departure.terminal}`);
      tripHTML.find("depart.gate").text(`Gate: ${trip.departure.gate}`);

      tripHTML.find(".arrive-date-text").text(trip.arrival.date);
      tripHTML.find(".city").text(trip.arrival.city);
      tripHTML.find(".terminal").text(`Terminal: ${trip.arrival.terminal}`);
      tripHTML.find("arrive.gate").text(`Gate: ${trip.arrival.gate}`);

      return tripHTML;

    })
    $(".trips-container").html(allTrips)
  }

  validateConfirmationCode(tripHTML, trip) {
    trip.confirmationCode !== undefined ? tripHTML.find(".confirmation-text").text(trip.confirmationCode) : null;
  }

  toggleHamburger() {
    $(".hamburger").click(function() {
      if ($(this).hasClass("is-active")) {
        $(this).removeClass("is-active");
      } else {
        $(this).addClass("is-active");
      }
    })
  }


  setToggleListener() {
    $(".trips-container").on('click', '.trip' , function() {
      const trip = $(this);
      if (trip.hasClass("slide-down")) {
        trip.find(".arrow-wrapper > i").removeClass("fa-caret-down");
        trip.find(".arrow-wrapper > i").addClass("fa-caret-up");
        trip.find(".arrival-wrapper").slideDown({duration: 450});
        trip.find(".departure-wrapper").slideDown({duration: 450});
        trip.removeClass("slide-down");
        trip.addClass("slide-up");

      } else {
        $(".arrow-wrapper > i").removeClass("fa-caret-up");
        $(".arrow-wrapper > i").addClass("fa-caret-down");
        trip.find(".arrival-wrapper").slideUp({duration: 450});
        trip.find(".departure-wrapper").slideUp({duration: 450}); 
        trip.removeClass("slide-up");
        trip.addClass("slide-down");
      }
    })
  }
}

const app = new Trips();
app.init();
