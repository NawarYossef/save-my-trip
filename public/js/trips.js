"use strict";
console.log(334);

class Trips  {

  init() {
    this.getTripEntries();
    this.toggleHamburger();
    this.slideDownAndShowDetails();
    this.changeArrowDirection();
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

  changeArrowDirection() {
    $(".trip-header").click(function(){
      if ($(this).hasClass("slide-down")) {
        $(".arrow-wrapper i").removeClass("fa-caret-down");
        $(".arrow-wrapper i").addClass("fa-caret-up");
      } else {
        $(".arrow-wrapper i").removeClass("fa-caret-up");
        $(".arrow-wrapper i").addClass("fa-caret-down");
      }
    });
  }

  slideDownAndShowDetails() {
    $(".trip-header").click(function(){
      if ($(this).hasClass("slide-down")) {
        $(this).removeClass("slide-down");
        $(this).addClass("slide-up");
        $(".arrival-wrapper").slideUp({duration: 450});
        $(".departure-wrapper").slideUp({duration: 450});  
      } else {
        $(this).removeClass("slide-up");
        $(this).addClass("slide-down");
        $(".arrival-wrapper").slideDown({duration: 450});
        $(".departure-wrapper").slideDown({duration: 450});
        // this.changeArrowDirection();
      }
    })
  }

  
}

const app = new Trips();
app.init();




