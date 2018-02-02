"use strict";

class Trips  {
  constructor() {
    this.state = {currentTripId: ''}
    this.token = localStorage.getItem("token");
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
    this.activeLinkBackgroundColor();
    // this.changeBackgroundColorForPageLink();
  }

  getTripEntries() {
    $.ajax({
      url: "/trips",
      type: 'GET',
      headers: {
        "Authorization": `Bearer ${this.token}`
      } 
    })
    .done(data => {
      this.renderTrips(data);
    })
    .fail(error => {
      console.error("something is wrong")
      console.error(error)
      window.location.replace(`/`)
    })
  }

  deleteTrip() {
    const that = this;
    $(".trips-container").on('click', '.delete-btn' , function() {
      const tripId = $(this).parents(".trip").attr('id')  

      $.ajax({
        url: `/trips/${tripId}`,
        type: 'DELETE',
        dataType: 'json',
        headers: {
          "Authorization": `Bearer ${that.token}`
        } 
      })
      .done(data => {
        that.changeRouteToTripsPage();
      })
      .fail(data => {
        console.error("something is wrong")
        window.location.replace(`/`)
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
    const that = this
    $('nav').on('click', '.trips, .new-trip, .log-out', function(e) {
      e.preventDefault();

      switch(true) {
        case ($(this).hasClass("trips")):
          window.location.replace(`/trips.html`);
          break;
        case $(this).hasClass("new-trip"):
          // change background color for page link when another link is clicked
          $(".trips").css("background", "#ffffff")
          window.location.replace(`/new-trip.html`)
          break;
        case $(this).hasClass("log-out"):
          // change background color for page link when another link is clicked
          $(".trips").css("background", "#ffffff")
          localStorage.removeItem("token");
          window.location.replace(`/`)
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
          localStorage.removeItem(this.token);
          window.location.replace(`/`)
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
    $("#send-email-btn").click(function() { 
      // e.preventDefault()
      console.log("FDdf")
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
        headers: {
          "Authorization": `Bearer ${that.token}`
        } 
      })
      .done((data) => {
        that.handleEmailSentMessage();
      })
      .fail((data) => {
        console.error("something is wrong")
        window.location.replace(`/`)
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

  activeLinkBackgroundColor() {
    $(".trips").css("background", "rgb(214, 214, 214)")
  }

  // changeBackgroundColorForPageLink() {
  //   $("").click(function() { 
  // }

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





// #### Show error message when password too short/username taken.(use the message on the server) LOGIN+SIGNUP
// #### Logout(delete the token)
// - Show right links on nav for logged in / not logged in base on has token
// - Responsiveness
// -  Footer
// ####Link trips on nav to /trips.html
// ####if they visit trips.html without token -> redirect them home
// - Change "your trips" -> "trips" and do active on the page you are on
// - ####delete ${} from html files
// - Deserialize the token, get the email and prepopulate the modal with the users email;