"use strict";

class NewTrip  {
  constructor() {
    this.token = localStorage.getItem("token");
  }

  init() {
    this.postNewTrip();
    this.initializeDateAndTimePicker();
    this.airportFieldAutocomplete();
    this.closeSidebar();
  }

  postNewTrip() {
    $("#new-trip-form").submit((e) => {
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
          city: $("#arrival-city").val(),
          airport: $("#arrival-airport").val(),
          terminal: $("#arrival-termianl").val(),
          gate: $("#arrival-gate").val(),
          date: $("#datepicker-2").val(),
        }
    }

      $.ajax({
        "type": "POST",
        url: '/trips',
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(trip),
        headers: {
          "Authorization": `Bearer ${this.token}`
        } 
      })
      .done(data => {
        this.changeRouteToTripsPage();
        // reset all form input values after form submission
        // $("#new-trip-form")[0].reset();
      })
      .fail(data => {
        console.error("something is wrong")
      })
    });
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

  changeRouteToTripsPage() {
    window.location.replace(`/trips.html`)
  }


  initializeDateAndTimePicker() {
    $("#datepicker-1, #datepicker-2")
    .flatpickr({ 
      enableTime: true,
      dateFormat: "m-d-y H:i",
      minDate: "today",
      time_24hr: false,
      
    })
  }

  airportFieldAutocomplete() {
    var options = {
      shouldSort: true,
      threshold: 0.4,
      maxPatternLength: 32,
      keys: [{
        name: 'iata',
        weight: 0.5
      }, {
        name: 'name',
        weight: 0.3
      }, {
        name: 'city',
        weight: 0.2
      }]
    };
    
    var fuse = new Fuse(airports, options)
    
    var inputs = ["#departure-airport", "#arrival-airport"]
    inputs.forEach((id) => {
    var ac = $(id)
      .on('click', function(e) {
        e.stopPropagation();
      })
      .on('focus keyup', search)
      .on('keydown', onKeyDown);
    
    var wrap = $('<div>')
      .addClass('autocomplete-wrapper')
      .insertBefore(ac)
      .append(ac);
    
    var list = $('<div>')
      .addClass('autocomplete-results')
      .on('click', '.autocomplete-result', function(e) {
        e.preventDefault();
        e.stopPropagation();
        selectIndex($(this).data('index'));
      })
      .appendTo(wrap);
    
    $(document)
      .on('mouseover', '.autocomplete-result', function(e) {
        var index = parseInt($(this).data('index'), 10);
        if (!isNaN(index)) {
          list.attr('data-highlight', index);
        }
      })
      .on('click', clearResults);
    
    function clearResults() {
      results = [];
      numResults = 0;
      list.empty();
    }
    
    function selectIndex(index) {
      if (results.length >= index + 1) {
        console.log(results[index].iata)
        ac.val(results[index].iata);
        clearResults();
      }  
    }
    
    var results = [];
    var numResults = 0;
    var selectedIndex = -1;
    
    function search(e) {
      if (e.which === 38 || e.which === 13 || e.which === 40) {
        return;
      }
      
      if (ac.val().length > 0) {
        results = _.take(fuse.search(ac.val()), 7);
        numResults = results.length;
        
        var divs = results.map(function(r, i) {
            return '<div class="autocomplete-result" data-index="'+ i +'">'
                 + '<div><b>'+ r.iata +'</b> - '+ r.name +'</div>'
                 + '<div class="autocomplete-location">'+ r.city +', '+ r.country +'</div>'
                 + '</div>';
         });
        
        selectedIndex = -1;
        list.html(divs.join(''))
          .attr('data-highlight', selectedIndex);
    
      } else {
        numResults = 0;
        list.empty();
      }
    }
    
    function onKeyDown(e) {
      switch(e.which) {
        case 38: // up
          selectedIndex--;
          if (selectedIndex <= -1) {
            selectedIndex = -1;
          }
          list.attr('data-highlight', selectedIndex);
          break;
        case 13: // enter
          selectIndex(selectedIndex);
          break;
        case 9: // enter
          selectIndex(selectedIndex);
          e.stopPropagation();
          return;
        case 40: // down
          selectedIndex++;
          if (selectedIndex >= numResults) {
            selectedIndex = numResults-1;
          }
          list.attr('data-highlight', selectedIndex);
          break;
    
        default: return; // exit this handler for other keys
      }
      e.stopPropagation();
      e.preventDefault(); // prevent the default action (scroll / move caret)
    }
  })
  }

  closeSidebar() {
    const that = this;
    $('header').on('click', '.trips, .new-trip, .log-out', function() {
      if (!$(".hamburger").hasClass("is-active")) {
        $(".hamburger").addClass("is-active")
        // make sure that side bar is hidden by default
        $(".side-menu-nav").removeClass("animated slideOutLeft");
        $(".side-menu-nav").fadeIn().addClass("show-side-bar animated slideInLeft");
        $(".side-menu-nav").fadeIn().addClass("center-side-bar");
      } else {
        $(".side-menu-nav").fadeOut().addClass("animated slideOutLeft");
        $(".hamburger").removeClass("is-active")
      }
    });
  }
}

const app = new NewTrip();
app.init();

