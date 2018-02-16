class Helpers {
  constructor() {
    this.token = localStorage.getItem("token");
  }
  
  init() {
    this.TokenCheck();
    this.handleSidebarSlide();
    this.handleHamburgerButton();
    this.userLogout();
    this.tripsPageRouter();
  }
  //route to landing page if there is no token
  TokenCheck() {
    if (window.location.href === 'https://save-my-trip.herokuapp.com/')  {
      this.handleLoginStatus();
    } else if(!this.token) {
      window.location.replace('/');
    }
  }

  handleLoginStatus() {
    if (this.token) {
      $(".log-out").css({"display": "inline-block"})
      $(".log-in").css({"display": "none"})
    }
    return null;
  }

  tripsPageRouter() {
    $(".trips").click(() => {
      if(!this.token) {
        // window.location.replace('/');
        $('html, body').animate({
          scrollTop: $("main").offset().top - 66
        }, 900);
      } else {
        window.location.replace(`/trips.html`)
      }
    })
  }

  handleSidebarSlide() {
    $(".hamburger").click(function() {
      if (!$(this).hasClass("is-active")) {
        // make sure that side bar is hidden by default
        $(".side-menu-nav").removeClass("animated slideOutLeft");
        $(".side-menu-nav").fadeIn().addClass("show-side-bar animated slideInLeft");
        $(".side-menu-nav").fadeIn().addClass("center-side-bar");
      } else {
        $(".side-menu-nav").fadeOut().addClass("animated slideOutLeft");
      }
    })
  }

  userLogout() {
    $(".log-out").click(() => {
      localStorage.removeItem("token");
      window.location.replace(`/`)
    })
  }

  handleHamburgerButton() {
    $(".hamburger").click(function() {
      ($(this).hasClass("is-active")) ? $(this).removeClass("is-active") : $(this).addClass("is-active");
    })
  }
}

const helpers = new Helpers();
helpers.init();