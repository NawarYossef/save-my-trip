"use strict";
console.log(334);

class Trips  {

  init() {
    this.getTripEntries();
    this.deleteTrip();
    this.showEmailModal();
    this.closeEmailModal();
    this.sendEmail();
    this.toggleHamburger();
    this.dropDownTripToggleListener();
    this.httpRedirectToEditPage();
  }

  getTripEntries() {
    $.ajax({
      url: "http://localhost:8081/trips",
      type: 'GET'
    })
    .done(data => {
      console.log(data)
      this.renderTrips(data);
    })
    .fail(data => {
      console.error("something is wrong")
    })
  }

  deleteTrip() {
    $(".trips-container").on('click', '.delete-btn' , () => {
      const tripId = $(this).parents(".trip").attr('id') 
      $.ajax({
        url: `http://localhost:8081/trips/${tripId}`,
        type: 'DELETE',
        dataType: 'json'
      })
      .done(data => {
        this.changeRouteToTripsPage();
      })
      .fail(data => {
        console.error("something is wrong")
      })
    })
  }

  changeRouteToTripsPage() {
    window.location.replace(`http://localhost:8081/trips.html`)
  }

  httpRedirectToEditPage() {
    $(".trips-container").on('click', '.edit-btn' , function() {
      const tripId = $(this).parents(".trip").attr('id') 
      window.location.replace(`http://localhost:8081/edit-trip.html?tripid=${tripId}`)
    })
  }

  renderTrips(data) {
    const allTrips = data.trips.map(trip => {
      const tripHTML = $("#example-trip").clone();
      
      tripHTML.removeClass("hidden")
      tripHTML.attr("id", trip.id);
      tripHTML.find(".confirmation-text").text(trip.confirmationCode);
      tripHTML.find(".depart-airport").text(trip.departure.airport);
      tripHTML.find(".arrive-airport").text(trip.arrival.airport);
      tripHTML.find(".departure-date").text(trip.departure.date);
      tripHTML.find(".airline-text").text(trip.airline);
      
      tripHTML.find(".depart-date-text").text(trip.departure.date);
      tripHTML.find(".depart-city").text(trip.departure.city);
      tripHTML.find(".depart-terminal").text(`Terminal: ${trip.departure.terminal}` || '-');
      tripHTML.find(".depart-gate").text(`Gate: ${trip.departure.gate}` || '-');

      tripHTML.find(".arrive-date-text").text(trip.arrival.date);
      tripHTML.find(".arrive-city").text(trip.arrival.city);
      tripHTML.find(".arrive-terminal").text(`Terminal: ${trip.arrival.terminal}` || '-');
      tripHTML.find(".arrive-gate").text(`Gate: ${trip.arrival.gate}` || '-');

      return tripHTML;
    })
  $(".trips-container").html(allTrips)
  }

  showEmailModal() {
    $(".trips-container").on('click', '.email-btn' , () => {
      $("#my-modal").css("display", "block");
      $(".modal-content").animate({'top' : '70px'}, 600);
    })
  }

  closeEmailModal() {
    $(".trips-container").on('click', '.close' , function() {
      $(this).parents().find(".modal").css("display", "none");
      $(this).parents().find(".modal-content").animate({'top' : '-100px'}, 600);
    })
  }
  
  sendEmail() {
    
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

  dropDownTripToggleListener() {
    $('.trip-header').addClass("slide-down");

    $(".trips-container").on('click', '.trip-header' , function() {
      const tripHeader = $(this);
      const trip = $(this).closest(".trip");

      if (tripHeader.hasClass("slide-down")) {
        tripHeader.find(".arrow-wrapper > i").removeClass("fa-caret-down");
        tripHeader.find(".arrow-wrapper > i").addClass("fa-caret-up");
        trip.find(".arrival-wrapper").slideDown({duration: 450});
        trip.find(".departure-wrapper").slideDown({duration: 450});
        tripHeader.removeClass("slide-down");
        tripHeader.addClass("slide-up");

      } else {
        tripHeader.find(".arrow-wrapper > i").removeClass("fa-caret-up");
        tripHeader.find(".arrow-wrapper > i").addClass("fa-caret-down");
        trip.find(".arrival-wrapper").slideUp({duration: 450});
        trip.find(".departure-wrapper").slideUp({duration: 450}); 
        tripHeader.removeClass("slide-up");
        tripHeader.addClass("slide-down");
      }
    })
  }
}

const app = new Trips();
app.init();
