"use strict";
const flatpickr = require("flatpickr");

class NewTrip  {

  init() {
    // this.initializeCalender();
    this.postNewTrip();
    this.toggleHamburger();
    this.dateAndTimePickerSetup();
  }

  // initializeCalender() {
  //   $("#datepicker-1").datepicker();
  //   $("#datepicker-2").datepicker();
  // }

  postNewTrip() {
    $("#new-trip-form").submit(function(e) {
      e.preventDefault();
      const trip = {
        airline: $("#airline").val(),
        confirmationCode: $("#confirmation").val(),
        departure: {
          city: $("#departure-city").val(),
          airport: $("#departure-airport").val(),
          terminal: $("#departure-terminal").val(),
          gate: $("#departure-gate").val(),
          date: $("#datepicker-1").val(),
        },
        arrival: {
          city: $("#departure-city").val(),
          airport: $("#departure-airport").val(),
          terminal: $("#departure-terminal").val(),
          gate: $("#departure-gate").val(),
          date: $("#datepicker-2").val(),
        }
    }
    console.log(trip)

      $.ajax({
        "type": "POST",
        url: 'http://localhost:8081/trips',
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(trip)
      })
      .done(data => {
        console.log(data)
      })
      .fail(data => {
        console.log(data)
        console.error("something is wrong")
      })
    });
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

  dateAndTimePickerSetup() {
    $("#datepicker-1").flatpickr({ enableTime: true,
      dateFormat: "Y-m-d H:i"
    })
  }
}

const app = new NewTrip();
app.init();

