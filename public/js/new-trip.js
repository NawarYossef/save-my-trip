"use strict";

class NewTrip {
  constructor() {
    this.token = localStorage.getItem("token");
  }

  init() {
    this.postNewTrip();
    this.initializeDateAndTimePicker();
  }

  postNewTrip() {
    $("#new-trip-form").submit(e => {
      e.preventDefault();
      const trip = {
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
          terminal: $("#arrival-termianl").val() || '--',
          gate: $("#arrival-gate").val() || '--',
          date: $("#datepicker-2").val()
        }
      };

      $.ajax({
        type: "POST",
        url: "/trips",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(trip),
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
        .done(data => {
          this.changeRouteToTripsPage();
          // reset all form input values after form submission
          // $("#new-trip-form")[0].reset();
        })
        .fail(error => {
          console.error("something is wrong", error);
        });
    });
  }

  showSidebar() {
    $(".hamburger").click(() => {
      $(".side-menu-nav").removeClass("animated slideOutRight");
      $(".side-menu-nav")
        .fadeIn()
        .addClass("show-side-bar animated slideInRight");
    });
  }

  hideSidebar() {
    $(".close-side-bar").click(() => {
      $(".side-menu-nav")
        .fadeOut()
        .addClass("animated slideOutRight");
    });
  }

  changeRouteToTripsPage() {
    window.location.replace(`/trips.html`);
  }

  initializeDateAndTimePicker() {
    $("#datepicker-1, #datepicker-2").flatpickr({
      altInput: true,
      minDate: "today",
      dateFormat: "m d, Y",
    });
  }
}

const app = new NewTrip();
app.init();
