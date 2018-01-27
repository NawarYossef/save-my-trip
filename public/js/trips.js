"use strict";

class Trips  {
  constructor() {
    this.state = {currentTripId: ''}
  }

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
      url: "/trips",
      type: 'GET'
    })
    .done(data => {
      this.renderTrips(data);
    })
    .fail(data => {
      console.error("something is wrong")
    })
  }

  deleteTrip() {
    const that = this;
    $(".trips-container").on('click', '.delete-btn' , function() {
      const tripId = $(this).parents(".trip").attr('id')  
      $.ajax({
        url: `/trips/${tripId}`,
        type: 'DELETE',
        dataType: 'json'
      })
      .done(data => {
        that.changeRouteToTripsPage();
      })
      .fail(data => {
        console.error("something is wrong")
      })
    })
  }

  changeRouteToTripsPage() {
    window.location.replace(`/trips.html`)
  }

  httpRedirectToEditPage() {
    $(".trips-container").on('click', '.edit-btn' , function() {
      const tripId = $(this).parents(".trip").attr('id') 
      window.location.replace(`/edit-trip.html?tripid=${tripId}`)
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
    const that = this
    $(".trips-container").on('click', '.email' , function() {
      // save the trip id 
      that.state.currentTripId = $(this).parents(".trip").attr('id') 
      $(".send-email-section").css("display", "block");
      $("#my-modal").css("display", "block");
      $('#my-modal').addClass('animated slideInDown');
      // $(".modal-content").animate({'top' : '70px'}, 600);
    })
  }

  closeEmailModal() {
    const that = this
    $(".trips-container").on('click', '.close' , function() {
      // reset the value of trip id when modal is closed
      that.state.currentTripId = '';
      $("#my-modal").removeClass("animated slideInDown").addClass('animated fadeOutRight');
    })
  }
  
  sendEmail() {
    const that = this;
    $(".trips-container").on('click', "#send-email-btn" , function() { 
      const emailInfo = {
        email: $("#email").val(),
        message: $("#comments").val() 
      }

      // reset modal input values 
      $("#email").val('')
      $("#comments").val('')

      $.ajax({
        "type": "POST",
        url: `/trips/email/${that.state.currentTripId}`,
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(emailInfo),
      })
      .done((data) => {
        console.log(data)
        that.emailSentMessage();
        // that.changeRouteToTripsPage();
        // reset all form input values after form submission
        // $("#new-trip-form")[0].reset();
      })
      .fail((data) => {
        console.error("something is wrong")
      })
    })
  }

  emailSentMessage() {
    $(".send-email-section").css("display", "none");
    $(".cont-for-success-message ").fadeIn(); 
    this.clearEmailSuccessMessage();
  }

  clearEmailSuccessMessage() {
    setTimeout(() => {
      $("#my-modal").removeClass("animated slideInDown").addClass('animated fadeOutRight');
    }, 1500)

    setTimeout(() => {
      $(".cont-for-success-message ").css("display", "none");
    }, 2000)
  }

  changeRouteToTripsPage() {
    window.location.replace(`/trips.html`)
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
