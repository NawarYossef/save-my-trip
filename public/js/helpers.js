class Helpers {
  constructor() {
    this.token = localStorage.getItem("token");
  }
  
  init() {
    this.TokenCheck();
    this.handleSidebar();
    this.handleHamburgerButton();
    this.userLogout();
  }
  //route to landing page if there is no token
  TokenCheck() {
    if(window.location.href === 'http://localhost:8081/') {
      return;
    } else if(!this.token) {
      window.location.replace('/');
    }
  }

  handleSidebar() {
    $(".hamburger").click(function() {
      if (!$(this).hasClass("is-active")) {
        // make sure that side bar is hidden by default
        $(".side-menu-nav").removeClass("animated slideOutLeft");
        $(".side-menu-nav").fadeIn().addClass("show-side-bar animated slideInLeft");
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