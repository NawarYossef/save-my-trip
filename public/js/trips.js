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
      success: (data) => {
        console.log(data)
        this.renderTrips(data);
      }
    });
  }

  renderTrips(data) {
    const allTrips = data.trips.map(trip => {
      return (
        `<div class="trip-header">
          <div class="confirmation col-4">
            <div class="confir-wrapper col-6">
              <span class="confirmation-title">CONFIRMATION</span><br>
              <span class="confirmation-text">${trip.confirmationCode}</span>
            </div>
          </div>

          <div class="airports-wrapper col-4">
            <h3>${trip.departure.airport}</h3>
            <i class="fa fa-arrow-right" aria-hidden="true"></i>
            <h3>${trip.arrival.airport}</h3>
            <h4>${trip.arrival.date}</h4>
          </div>

          <div class="data-wrapper col-4">
            <div class="airline-wrapper col-6">
              <span class="airline-title">AIRLINE</span><br>
              <span class="airline-text">${trip.airline}</span>
            </div>
            <div class="arrow-wrapper col-6">
              <i class="fa fa-caret-down" aria-hidden="true"></i>
            </div>
          </div>
        </div>
        <div class="trip-details">
          <div class="departure-wrapper col-12">
            <p><span class="depart-word">DEPARTS:</span><span class="date-text">${trip.departure.date}</span></p>
            <p class="city">${trip.departure.city}</p>

            <div class="terminal-gate-wrapper col-4">
              <p class="terminal">Terminal: ${trip.departure.terminal}</p>
              <p class="gate">Gate: ${trip.departure.gate}</p>
            </div>
          </div>
          <div class="arrival-wrapper col-12">
            <p><span class="depart-word">ARRIVES:</span><span class="date-text">${trip.arrival.date}</span></p>
            <p class="city">${trip.arrival.city}</p>

            <div class="terminal-gate-wrapper col-4">
              <p class="terminal">Terminal: ${trip.arrival.terminal}</p>
              <p class="gate">Gate: ${trip.arrival.gate}</p>
            </div>
          </div>
          <div class="col-12 control-btns">
            <button class="col-4 edit-btn">
              Edit
              <i class="fa fa-pencil" aria-hidden="true"></i>    
            </button>
            <button class="col-4 delete-btn">
              Delete
              <i class="fa fa-trash-o" aria-hidden="true"></i>
            </button>
            <button class="col-4 email-btn">  
              Email
              <i class="fa fa-envelope" aria-hidden="true"></i>
            </button>
          </div>
        </div>`
      )
    })

    $(".trip-container").append(allTrips)
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




