"use strict";

class SaveMyTrip {
  constructor() {
    this.token = localStorage.getItem("token");
  }

  init() {
    this.showLoginModal();
    this.closeLoginModal();
    this.signUpUser();
    this.logInUser();
    this.headerNavigation();
    this.sidebarNavigation();
  }

  showLoginModal() {
    $(".log-in, .go-to-login-button").click(() => {
      $("#my-modal").css("display", "block");
      $('#my-modal').addClass('animated slideInDown');
    })
  }

  closeLoginModal() {
    $(".close").click(() => {
      $("#my-modal").removeClass("animated slideInDown").addClass('animated fadeOutRight');
    })
  }

  headerNavigation() {
    $('header').on('click', '.about, .sign-up', function(e) {
      e.preventDefault();

      switch(true) {
        case $(this).hasClass("about"):
          $('html, body').animate({
            scrollTop: $(".about-section").offset().top
          }, 900);
          break;
        case $(this).hasClass("sign-up"):
          $('html, body').animate({
					  scrollTop: $("#sign-up").offset().top
			    }, 900);
          break;
        default:
          // do nothing
      }
    });
  }

  sidebarNavigation() {
    $('.side-menu-nav').on('click', '.about, .sign-up', function(e) {
      e.preventDefault();

      switch(true) {
        case $(this).hasClass("about"):
          $('html, body').animate({
            scrollTop: $(".about-section").offset().top
          }, 900);
          break;
        case $(this).hasClass("sign-up"):
          $('html, body').animate({
					  scrollTop: $("#sign-up").offset().top
			    }, 900);
          break;
          default:
          // do nothing
      }
    });
  }
  
  signUpUser() {
    const that = this;
    $(".register").submit((e) => {
      e.preventDefault();

      const userInfo = {
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        username: $("#username").val(),
        password: $("#password").val()
      }

      $.ajax({
        "type": "POST",
        url: "/api/users/signup",
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(userInfo)
      })
      .done((data) => {
        console.log(userInfo)
        that.hideInvalidMessage();
        that.hideSignupSection();
        that.showLogInSection();
        // reset input values for new input
        that.resetInputValues();
      })
      .fail((error) => {
        that.showInvalidMessage(error);
        console.error("something is wrong");
      })
    })
  }

  resetInputValues() {
    $("#firstName").val("");
    $("#lastName").val("");
    $("#username").val("");
    $("#password").val(""); 
  }

  showInvalidMessage(data) { 
    const field = data.responseJSON.location.charAt(0).toUpperCase() + data.responseJSON.location.slice(1);
    $(".invalid-message-txt").text(`Invalid entry. ${field} ${data.responseJSON.message}`)
    $(".cont-for-invalid-message").css("display", "block")
  }

  hideInvalidMessage() {
    $(".cont-for-invalid-message").css("display", "none");
    $(".cont-for-invalid-message").text('');
  }

  logInUser() {
    const that = this;
    $(".log-in").submit((e) => {
      e.preventDefault();

      const userInfo = {
        username: $("#sign-in-username").val(),
        password: $("#sign-in-password").val()
      }

      $.ajax({
        "type": "POST",
        url: "/api/auth/login",
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(userInfo)
      })
      .done((data) => {
        // store JWT to local storage and save it across all browser sessions
        localStorage.setItem('token', data.authToken);
        this.changeRouteToTripsPage()
      })
      .fail((error) => {
        console.error("something is wrong");
        this.showInvalidLoginMessage();
      })
    })
  }

  showInvalidLoginMessage() {
    $(".invalid-message-txt-login").text(`Invalid username or password. Please try again`)
    $(".cont-for-invalid-message-login").css("display", "block")
  }

  hideInvalidLoginMessage() {
    $(".cont-for-invalid-message-login").css("display", "none");
    $(".cont-for-invalid-message-login").text('');
  }

  changeRouteToTripsPage() {
    window.location.replace(`/trips.html`)
  }

  showLogInSection() {
    $(".heading-for-trips-login, .go-to-login-section").show();
  }

  hideSignupSection() {
    $(".heading-for-trips, .sign-up-wrapper").hide(); 
  }
}

const app = new SaveMyTrip();
app.init();