"use strict";

class SaveMyTrip {
  init() {
    this.showModal();
    this.closeModal();
    this.scrollDownToSignUpSection();
  }

  showModal() {
    $(".log-in").click(() => {
      $("#my-modal").css("display", "block");
      $(".modal-content").animate({'top' : '100px'}, 600);

    })
  }

  closeModal() {
    $(".close").click(() => {
      $("#my-modal").css("display", "none");
      $(".modal-content").animate({'top' : '-100px'}, 600);
    })
  }

  scrollDownToSignUpSection() {
		$(".sign-up-btn").click(() => {
			$('html, body').animate({
					scrollTop: $("#sign-up").offset().top
			}, 900);
		});
	}
}

const app = new SaveMyTrip();
app.init();