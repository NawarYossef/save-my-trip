"use strict";

class Trips {
  constructor() {
    this.state = { currentTripId: "" };
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
  }

  getTripEntries() {
    $.ajax({
      url: "/trips",
      type: "GET",
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    })
      .done(data => {
        this.renderTrips(data);
      })
      .fail(error => {
        console.error("something is wrong", error);
      });
  }

  deleteTrip() {
    const that = this;
    $(".trips-container").on("click", ".delete-btn", function() {
      const tripId = $(this)
        .parents(".trip")
        .attr("id");

      $.ajax({
        url: `/trips/${tripId}`,
        type: "DELETE",
        dataType: "json",
        headers: {
          Authorization: `Bearer ${that.token}`
        }
      })
        .done(data => {
          that.changeRouteToTripsPage();
        })
        .fail(data => {
          console.error("something is wrong", error);
          window.location.replace(`/`);
        });
    });
  }

  changeRouteToTripsPage() {
    window.location.replace(`/trips.html`);
  }

  httpRedirectToEditPage() {
    const that = this;
    $(".trips-container").on("click", ".edit-btn", function() {
      const tripId = $(this)
        .parents(".trip")
        .attr("id");
      window.location.replace(`/edit-trip.html?tripid=${tripId}`);
    });
  }

  renderTrips(data) {
    const allTrips = data.trips.map(trip => {
      const tripHTML = $("#example-trip").clone();

      tripHTML.removeClass("hidden");
      tripHTML.attr("id", trip.id);
      tripHTML.find(".confirmation-text").text(trip.confirmationCode);
      tripHTML.find(".depart-airport").text(trip.departure.airport);
      tripHTML.find(".arrive-airport").text(trip.arrival.airport);
      tripHTML
        .find(".departure-date")
        .text(this.parseDate(trip.departure.date));
      tripHTML.find(".airline-text").text(trip.airline);

      tripHTML
        .find(".depart-date-text")
        .text(this.parseDate(trip.departure.date));
      tripHTML.find(".depart-city").text(trip.departure.city);
      tripHTML
        .find(".depart-terminal")
        .text(`Terminal: ${trip.departure.terminal}` || "-");
      tripHTML.find(".depart-gate").text(`Gate: ${trip.departure.gate}` || "-");

      tripHTML
        .find(".arrive-date-text")
        .text(this.parseDate(trip.arrival.date));
      tripHTML.find(".arrive-city").text(trip.arrival.city);
      tripHTML
        .find(".arrive-terminal")
        .text(`Terminal: ${trip.arrival.terminal}` || "-");
      tripHTML.find(".arrive-gate").text(`Gate: ${trip.arrival.gate}` || "-");
      return tripHTML;
    });
    $(".trips-container").html(allTrips);
  }

  parseDate(data) {
    const month = new Date(data).toString().split(" ")[1];
    const day = new Date(data).toString().split(" ")[2];
    const year = new Date(data).toString().split(" ")[3];
    return month + " " + day + ", " + year;
  }

  showEmailModal() {
    const that = this;
    $(".trips-container").on("click", ".email", function() {
      // remove css class responsible for closing modal to insure that modal slides down with each click event.
      $("#my-modal").removeClass("animated fadeOutRight")
      // save the trip id
      that.state.currentTripId = $(this).parents(".trip").attr("id");
      $("#my-modal").css("display", "block");
       $(".send-email-section").fadeIn()
      $(".modal-content").addClass("animated slideInDown");
    });
  }

  closeEmailModal() {
    const that = this;
    $(".trips-container").on("click", ".close", function() {
      // reset the value of trip id when modal is closed
      that.state.currentTripId = "";
      $(".modal-content")
        .removeClass("animated slideInDown")
        .addClass("animated fadeOutRight");
        $("#my-modal").fadeOut(1200);
    });
  }

  emailHandler() {
    const that = this;
    $("body").on("submit", "#email-trip-form", function(e) {
      e.preventDefault();

      that.clearEmailMessage();
      // store input values in order to send it in the POST request
      const emailInfo = {
        title: $("#title").val(),
        email: $("#email").val(),
        message: $("#comments").val()
      };

      // reset modal input values
      $("#title").val("");
      $("#email").val("");
      $("#comments").val("");

      $.ajax({
        type: "POST",
        url: `/trips/email/${that.state.currentTripId}`,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(emailInfo),
        headers: {
          Authorization: `Bearer ${that.token}`
        }
      })
        .done(data => {
          that.handleEmailSuccess();
        })
        .fail(error => {
          console.error("something is wrong", error);
          that.handleEmailFail();
        });
    });
  }

  handleEmailSuccess() {
    $(".send-email-section").css("display", "none");
    $(".cont-for-success-message ").fadeIn();
    this.clearEmailMessage();
  }

  handleEmailFail() {
    $(".send-email-section").css("display", "none");
    $(".cont-for-fail-message ").fadeIn();
    this.clearEmailMessage();
  }

  clearEmailMessage() {
    setTimeout(() => {
      $("#my-modal")
        .removeClass("animated slideInDown")
        .addClass("animated fadeOutRight");
    }, 1500);

    setTimeout(() => {
      $(".cont-for-success-message, .cont-for-fail-message ").css("display", "none");
    }, 2000);
  }

  changeRouteToTripsPage() {
    window.location.replace(`/trips.html`);
  }

  dropDownTripToggleListener() {
    $(".trip-header").addClass("slide-down");

    $(".trips-container").on("click", ".trip-header", function() {
      const tripHeader = $(this);
      const trip = $(this).closest(".trip");

      if (tripHeader.hasClass("slide-down")) {
        tripHeader.find(".arrow-wrapper > i").removeClass("fa-caret-down");
        tripHeader.find(".arrow-wrapper > i").addClass("fa-caret-up");
        trip
          .find(".arrival-wrapper")
          .slideDown({ duration: 450 })
          .css({ display: "inline-block" });
        trip
          .find(".departure-wrapper")
          .slideDown({ duration: 450 })
          .css({ display: "inline-block" });
        tripHeader.removeClass("slide-down");
        tripHeader.addClass("slide-up");
      } else {
        tripHeader.find(".arrow-wrapper > i").removeClass("fa-caret-up");
        tripHeader.find(".arrow-wrapper > i").addClass("fa-caret-down");
        trip.find(".arrival-wrapper").slideUp({ duration: 450 });
        trip.find(".departure-wrapper").slideUp({ duration: 450 });
        tripHeader.removeClass("slide-up");
        tripHeader.addClass("slide-down");
      }
    });
  }
}

const app = new Trips();
app.init();
