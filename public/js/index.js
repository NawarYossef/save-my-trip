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
    this.NavbarScrollToSection();
    this.changeHeaderStylesOnScroll();
    this.reviewSlideShow();
    this.tripsEndpointAuthValidation();
  }

  showLoginModal() {
    const that = this
    $(".log-in, .go-to-login-button").click(function() {
      $("#my-modal").css("display", "block");
      $('.modal-content').addClass('animated slideInDown');
      if($(this).hasClass("log-in-side-bar-link")) {
        that.closeSidebar();
      }
    })
  }

  closeLoginModal() {
    $(".close").click(() => {
      $(".modal-content").removeClass("animated slideInDown").addClass('animated fadeOutRight');
      $("#my-modal").fadeOut(1200);    
    })
  }

  NavbarScrollToSection() {
    const that = this;
    $('header').on('click', '.about, .sign-up-btn, .about-side-bar-link, .trips, .trips-side-bar-link', function(e) {
      e.preventDefault();
      switch(true) {
        // case $(this).hasClass("about"):
        //   $('html, body').animate({
        //     scrollTop: $("main").offset().top - 66
        //   }, 900);
        //   break;
        
        case $(this).hasClass("about"):
          that.closeSidebar();
          $('html, body').animate({
            scrollTop: $("main").offset().top - 66
          }, 900);
          break;
        
        case $(this).hasClass("trips-side-bar-link"):
          if(!this.token) {
              that.closeSidebar();
              $('html, body').animate({
                scrollTop: $("main").offset().top + 830
            }, 900);
            break;
          }

        case $(this).hasClass("trips"):
          if(!this.token) {
            $('html, body').animate({
              scrollTop: $("main").offset().top + 430
            }, 900);
            break;
          }

        case $(this).hasClass("sign-up-btn"):
          $('html, body').animate({
					  scrollTop: $("#sign-up").offset().top - 105
			    }, 1000);
          break;
                 
        default:
          // do nothing
      }
    });
  }

  closeSidebar() {
    $(".side-menu-nav").fadeOut().addClass("animated slideOutLeft");
    $(".hamburger").removeClass("is-active");
  }

  // openSideBar() {
  //   if (!$(".hamburger").hasClass("is-active")) {
  //     $(".hamburger").addClass("is-active")
  //     // make sure that side bar is hidden by default
  //     $(".side-menu-nav").removeClass("animated slideOutLeft");
  //     $(".side-menu-nav").fadeIn().addClass("show-side-bar animated slideInLeft");
  //     $(".side-menu-nav").fadeIn().addClass("center-side-bar");
  //   }
  // }
  
  signUpUser() {
    const that = this;
    $(".register").submit((e) => {
      e.preventDefault();

      const userInfo = {
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        username: $("#username").val(),
        password: $("#password").val(),
        email: $("#email").val()
      }

      $.ajax({
        "type": "POST",
        url: "/api/users/signup",
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(userInfo)
      })
      .done((data) => {
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
    $("#email").val(""); 
  }

  showInvalidMessage(data) { 
    const field = data.responseJSON.location.charAt(0).toUpperCase() + data.responseJSON.location.slice(1);
    $(".invalid-message-txt").text(`Invalid entry. ${field} ${data.responseJSON.message}`)
    $(".cont-for-invalid-message").fadeIn().css("display", "block")
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
    $(".heading-for-trips-login, .go-to-login-section").fadeIn().show();
  }

  hideSignupSection() {
    $(".heading-for-trips, .sign-up-wrapper").fadeOut().hide(); 
  }

  changeHeaderStylesOnScroll() {
    $(document).scroll(function(){
      if($(this).scrollTop() > 180)
      {   
        $('.header-wrapper').css({
          transition : 'background-color 0.2s ease-in-out',
          "background-color": "rgba(0,0,0,0.9)",
          "box-shadow": "0 0 16px 8px rgba(0,0,0,.5)",
          "-webkit-box-shadow": "0 0 16px 8px rgba(0,0,0,.5)",
          "-moz-box-shadow": "0 0 16px 8px rgba(0,0,0,.5)"
        });
      } else {
        $('.header-wrapper').css({
          "background":"transparent",
          "box-shadow": "initial",
          "-webkit-box-shadow": "initial",
          "-moz-box-shadow":  "initial"
           
        });
      }
    });
  } 

  reviewSlideShow() {
    $(function(){
      $('.reviews-wrapper').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        speed: 1000,
        autoplaySpeed: 4000,
      });
    })
  }

  tripsEndpointAuthValidation() {
    $(".trips").click(() => {
      this.token ? this.changeRouteToTripsPage() : null;
    })
  }
}

const app = new SaveMyTrip();
app.init();