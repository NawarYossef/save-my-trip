"use strict";

class SaveMyTrip {
  init() {
    this.showModal();
    this.closeModal();
  }

  showModal() {
    $(".log-in").click(() => {
      $("#my-modal").css("display", "block");
      $(".modal-content").animate({'top' : '50px'}, 600);

    })
  }

  closeModal() {
    $(".close").click(() => {
      $("#my-modal").css("display", "none");
      $(".modal-content").animate({'top' : '-50px'}, 600);
    })
  }
}

const app = new SaveMyTrip();
app.init();