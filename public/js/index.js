"use strict";

class SaveMyTrip {
  init() {
    this.showModal();
    this.closeModal();
  }

  showModal() {
    $(".log-in").click(() => {
      $("#my-modal").css("display", "block");

    })
  }

  closeModal() {
    $(".close").click(() => {
      $("#my-modal").css("display", "none");
    })
  }
}

const app = new SaveMyTrip();
app.init();