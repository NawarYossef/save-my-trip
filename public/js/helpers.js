class Helpers {
  constructor() {
    this.token = localStorage.getItem("token");
  }

  init() {
    this.TokenCheck();
    this.handleSidebarSlide();
    this.handleHamburgerButton();
    this.userLogout();
    this.closeSidebar();
  }
  //route to landing page if there is no token
  TokenCheck() {
    if (window.location.pathname === "/") {
      this.handleLoginStatus();
    } else if (!this.token) {
      window.location.replace("/");
      return;
    }
  }

  handleLoginStatus() {
    if (this.token) {
      $(".log-out").css({ display: "inline-block" });
      $(".log-in").css({ display: "none" });
    }
    return null;
  }

  handleSidebarSlide() {
    $(".hamburger").click(function() {
      if (!$(this).hasClass("is-active")) {
        // make sure that side bar is hidden by default
        $(".side-menu-nav").removeClass("animated slideOutLeft");
        $(".side-menu-nav")
          .fadeIn()
          .addClass("show-side-bar animated slideInLeft");
        $(".side-menu-nav")
          .fadeIn()
          .addClass("center-side-bar");
      } else {
        $(".side-menu-nav")
          .fadeOut()
          .addClass("animated slideOutLeft");
      }
    });
  }

  userLogout() {
    $(".log-out").click(() => {
      localStorage.removeItem("token");
      window.location.replace(`/`);
    });
  }

  handleHamburgerButton() {
    $(".hamburger").click(function() {
      $(this).hasClass("is-active")
        ? $(this).removeClass("is-active")
        : $(this).addClass("is-active");
    });
  }

  closeSidebar() {
    $("header").on("click", ".trips-side-bar-link, .new-trip, .log-out", () => {
      if (!$(".hamburger").hasClass("is-active")) {
        $(".hamburger").addClass("is-active");
        // make sure that side bar is hidden by default
        $(".side-menu-nav").removeClass("animated slideOutLeft");
        $(".side-menu-nav")
          .fadeIn()
          .addClass("show-side-bar animated slideInLeft");
        $(".side-menu-nav")
          .fadeIn()
          .addClass("center-side-bar");
      } else {
        $(".side-menu-nav")
          .fadeOut()
          .addClass("animated slideOutLeft");
        $(".hamburger").removeClass("is-active");
      }
    });
  }
}

const helpers = new Helpers();
helpers.init();
