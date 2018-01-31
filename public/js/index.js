"use strict";

class SaveMyTrip {
  constructor() {
    this.token = localStorage.getItem("token");
  }

  init() {
    this.showModal();
    this.closeModal();
    this.scrollDownToSignUpSection();
    this.signUpUser();
    this.logInUser();
  }

  showModal() {
    $(".log-in, .go-to-login-button").click(() => {
      $("#my-modal").css("display", "block");
      $('#my-modal').addClass('animated slideInDown');
    })
  }

  closeModal() {
    $(".close").click(() => {
      $("#my-modal").removeClass("animated slideInDown").addClass('animated fadeOutRight');
    })
  }

  scrollDownToSignUpSection() {
		$(".sign-up-btn").click(() => {
			$('html, body').animate({
					scrollTop: $("#sign-up").offset().top
			}, 900);
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
        data: JSON.stringify(userInfo),
        headers: {
          "Authorization": `Bearer ${that.token}`
        } 
      })
      .done((data) => {
        console.log(userInfo)
        that.hideSignupSection();
        that.showLogInSection();
      })
      .fail((data) => {
        console.error("something is wrong")
      })
    })
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
        data: JSON.stringify(userInfo),
        headers: {
          "Authorization": `Bearer ${that.token}`
        }
      })
      .done((data) => {
        // store JWT to local storage and save it across all browser sessions
        // localStorage.setItem('token', data.authToken);
        this.changeRouteToTripsPage()
      })
      .fail((data) => {
        console.error("something is wrong")
      })
    })
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