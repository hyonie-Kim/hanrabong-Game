'use strict';

const HANRABONG_SIZE = 85;
const HANRABONG_COUNT = 5;
const YELLOW_HANRABONG_COUNT = 5;
const DOLHARBANG_COUNT = 5;
const GAME_DURATION_SEC = 10;

const field = document.querySelector('.game_field');
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game_button');
const gameTimer = document.querySelector('.game_timer');
const gameScore = document.querySelector('.game_score');

// 팝업
const gamePopUp = document.querySelector('.game_popUp');
const PopUpRefresh = document.querySelector('.popUp_refresh');
const PopUpMessage = document.querySelector('.popUp_message');

// 오디오 파일 경로를 넣어 파일에 대한 정보
const hanrabongSound = new Audio('../sound/hanrabong_pull.mp3');
const winSound = new Audio('../sound/game_win.mp3');
const dolharbangSound = new Audio('../sound/dolharbang_pull.mp3');
const bgSound = new Audio('../sound/bg.mp3');
const alertSound = new Audio('../sound/alert.wav');

let started = false;
let timer = undefined;
let score = 0;

field.addEventListener('click', onFieldClick);
gameBtn.addEventListener('click', () => {
  console.log('클릭');
  if (started) {
    stopGame();
  } else {
    startGame();
  }
});

PopUpRefresh.addEventListener('click', () => {
  startGame();
  hidePopUp();
});

// 게임시작
function startGame() {
  started = true;
  initGame();
  showStopBtn();
  showTimerAndScore();
  startGameTimer();
  playSound(bgSound);
}

// 게임정지
function stopGame() {
  started = false;
  stopGameTimer();
  hideGameBtn();
  showPopUpWithText(
    '한라봉이 아직 몇 개 남았네요.<br>포기하지 마시고 계속해서 도전해보세요!'
  );
  playSound(alertSound);
  stopSound(bgSound);
}

// 게임 종료
function finishGame(win) {
  started = false;
  hideGameBtn();
  if (win) {
    playSound(winSound);
  } else {
    playSound(dolharbangSound);
  }

  stopGameTimer();
  stopSound(bgSound);
  showPopUpWithText(
    win
      ? '우와!한라봉을 모두 수확했어요!🎉<br> 대단해요!'
      : '아쉽지만 모든 한라봉을 따지 못했네요.다음에 다시 도전해보세요!'
  );
}

function showPopUpWithText(text) {
  PopUpMessage.innerHTML = text;
  gamePopUp.classList.remove('popUp-hide');
}

function hidePopUp() {
  gamePopUp.classList.add('popUp-hide');
}

function showStopBtn() {
  const icon = gameBtn.querySelector('.fa-solid');
  icon.classList.add('fa-stop');
  icon.classList.remove('fa-play');
  gameBtn.style.visibility = 'visible';
}

// 게임버튼
function hideGameBtn() {
  gameBtn.style.visibility = 'hidden';
}

function showTimerAndScore() {
  gameTimer.style.visibility = 'visible';
  gameScore.style.visibility = 'visible';
}

function startGameTimer() {
  let remainingTimeSec = GAME_DURATION_SEC;
  updateTimerText(remainingTimeSec);
  timer = setInterval(() => {
    if (remainingTimeSec <= 0) {
      clearInterval(timer);
      finishGame(HANRABONG_COUNT === score);
      return;
    }
    updateTimerText(--remainingTimeSec);
  }, 1000);
}

function stopGameTimer() {
  clearInterval(timer);
}

function updateTimerText(time) {
  //const minutes = Math.floor(time / 60);
  // gameTimer.innerHTML = `${minutes}:${seconds}`;
  const seconds = time % 60;
  gameTimer.innerHTML = `🔔 ${seconds}초`;
}

function initGame() {
  score = 0;
  field.innerHTML = '';
  gameScore.innerHTML = HANRABONG_COUNT + YELLOW_HANRABONG_COUNT;
  //gameScore.innerHTML = HANRABONG_COUNT;
  // 한라봉과 돌하르방을 생성하여 field에 추가
  console.log(fieldRect);
  addItem('hanrabong', HANRABONG_COUNT, 'image/hanrabong.png');
  addItem(
    'yellow_hanrabong',
    YELLOW_HANRABONG_COUNT,
    'image/yellow_hanrabong.png'
  );

  addItem('dolharbang', DOLHARBANG_COUNT, 'image/dolharbang.png');
}

function onFieldClick(event) {
  if (!started) {
    return;
  }
  console.log(event);
  const target = event.target;
  if (target.matches('.hanrabong') || target.matches('.yellow_hanrabong')) {
    // 한라봉 획득
    target.remove();
    score++;
    playSound(hanrabongSound);
    updateScoreBoard(); //  스코어
    if (score === HANRABONG_COUNT + YELLOW_HANRABONG_COUNT) {
      finishGame(true);
    }
  } else if (target.matches('.dolharbang')) {
    finishGame(false);
  }
}

function playSound(sound) {
  sound.currentTime = 0; // audio의 재생시점을 0초로 설정함
  sound.play();
}

function stopSound(sound) {
  sound.pause(); // 일시 정지
}
function updateScoreBoard() {
  //gameScore.innerHTML = score;
  gameScore.innerHTML = HANRABONG_COUNT + YELLOW_HANRABONG_COUNT - score;
}

// 한라봉, 돌하르빙 생성
function addItem(className, value, imgPath) {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - HANRABONG_SIZE;
  const y2 = fieldRect.height - HANRABONG_SIZE;

  for (let i = 0; i < value; i++) {
    const item = document.createElement('img');
    item.setAttribute('class', className);
    item.setAttribute('src', imgPath);
    item.style.position = 'absolute';

    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;

    field.appendChild(item);
  }
}

// 주어진 범위에 원하는 랜덤 숫자 리턴
function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
