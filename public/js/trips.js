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
    this.emailHandler();
    this.dropDownTripToggleListener();
    this.httpRedirectToEditPage();
    this.showSidebar();
    this.hideSidebar();
    this.navbarNavigation();
    this.sidebarNavigation(); 
  }

  getTripEntries() {
    $.ajax({
      url: "/trips",
      type: 'GET'
      // headers: {
      //   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoibmFtZSIsImZpcnN0TmFtZSI6ImZpcnN0bmFtZSIsImxhc3ROYW1lIjoibGFzdG5hbWUifSwiaWF0IjoxNTE3MjQ3ODQ1LCJleHAiOjE1MTc4NTI2NDUsInN1YiI6Im5hbWUifQ.4FitM7W75z9VYPK1RDw1u6p-S3OM5bi_n5-N1SUd4Ww"
      // } 
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

  showSidebar() {
    $(".hamburger").click(() => {
      $(".side-menu-nav").removeClass("animated slideOutRight")
      $(".side-menu-nav").fadeIn().addClass("show-side-bar animated slideInRight")
    })
  }

  hideSidebar() {
    $(".close-side-bar").click(() => {
      $(".side-menu-nav").fadeOut().addClass("animated slideOutRight")
    })
  }

  navbarNavigation() {
    $('nav').on('click', '.trips, .new-trip, .log-out, .booking', function(e) {
      e.preventDefault();

      switch(true) {
        case $(this).hasClass("trips"):
          window.location.replace(`/trips.html`);
          break;
        case $(this).hasClass("new-trip"):
          window.location.replace(`/new-trip.html`)
          break;
        case $(this).hasClass("log-out"):
          window.location.replace(`/`)
          break;
        case $(this).hasClass("booking"):
          window.location.replace(`/booking.html`)
          break;
        default:
          // do nothing
      }
    });
  }

  sidebarNavigation() {
    $('.side-menu-nav').on('click', '.trips, .new-trip, .log-out, .booking', function(e) {
      e.preventDefault();
      console.log($(this).hasClass("new-trip"))
      switch(true) {
        case $(this).hasClass("trips"):
          window.location.replace(`/trips.html`);
          break;
        case $(this).hasClass("new-trip"):
          window.location.replace(`/new-trip.html`)
          break;
        case $(this).hasClass("log-out"):
          window.location.replace(`/`)
          break;
        case $(this).hasClass("booking"):
          window.location.replace(`/booking.html`)
          break;
        default:
          // do nothing
      }
    });
  }

  showEmailModal() {
    const that = this
    $(".trips-container").on('click', '.email' , function() {
      // save the trip id 
      that.state.currentTripId = $(this).parents(".trip").attr('id') 
      $(".send-email-section").css("display", "block");
      $("#my-modal").css("display", "block");
      $('#my-modal').addClass('animated slideInDown');
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
  
  emailHandler() {
    const that = this;
    $(".modal-form").submit(function(e) { 
      e.preventDefault()
      // store input values in order to send it in the POST request
      const emailInfo = {
        title: $("#title").val(),
        email: $("#email").val(),
        message: $("#comments").val() 
      }

      // reset modal input values 
      $("#title").val('')
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
        that.handleEmailSentMessage();
      })
      .fail((data) => {
        console.error("something is wrong")
      })
    })
  }

  handleEmailSentMessage() {
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
