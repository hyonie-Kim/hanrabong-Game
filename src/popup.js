'use strict';

class PopUp {
  constructor() {
    this.gamePopUp = document.querySelector('.game_popUp');
    this.PopUpRefresh = document.querySelector('.popUp_refresh');
    this.PopUpMessage = document.querySelector('.popUp_message');

    this.PopUpRefresh.addEventListener('click', () => {
      this.onClick && this.onClick();
      // 팝업 없애기
      hide();
    });
  }

  setClickListener(onClick) {
    this.onClick = onClick;
  }

  showWithText(text) {
    this.PopUpMessage.innerHTML = text;
    this.gamePopUp.classList.remove('popUp-hide');
  }

  hide() {
    this.gamePopUp.classList.add('popUp-hide');
  }
}
