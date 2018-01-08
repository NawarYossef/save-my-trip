"use strict";
console.log(334);

class Trips  {

  init() {
    this.getTripEntries();
    this.toggleHamburger();
  }

  getTripEntries() {
    $.ajax({
      url: "http://localhost:8081/trips",
      type: 'GET',   
      success: function(data){
        console.log(data)
      }
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

const app = new Trips();
app.init();




