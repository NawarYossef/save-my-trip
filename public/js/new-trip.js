"use strict";

class NewTrip  {

  init() {
    this.initializeCalender();
    this.postNewTrip();
    this.toggleHamburger();
  }

  initializeCalender() {
    $("#datepicker-1").datepicker();
    $("#datepicker-2").datepicker();
    $(".header-wrapper").animate({top: "300px"});
  }

  postNewTrip() {
    $("#new-trip-form").submit((e) => {
      e.preventDefault();
      console.log(34);

      $.ajax({
        url: "http://localhost:8081/trips",
        type: 'POST',  
        dataType: "html"
      })
      .done(data => {
        console.log(data)
      })
      .fail(data => {
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
}

const app = new NewTrip();
app.init();

