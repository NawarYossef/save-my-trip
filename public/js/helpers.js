class Helpers {
  constructor() {
    this.token = localStorage.getItem("token");
  }
  
  init() {
    this.TokenCheck();
    this.showSidebar();
    this.hideSidebar();
    this.userLogout();
  }
  //route to landing page if there is no token
  TokenCheck() {
    if(window.location.href === 'http://localhost:8081/') {
      return;
    } else if(!this.token) {
      window.location.replace('/')
    }
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

  userLogout() {
    $(".log-out").click(() => {
      localStorage.removeItem("token");
      window.location.replace(`/`)
    })
  }
}

const helpers = new Helpers();
helpers.init();