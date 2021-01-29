// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoreArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';

// Scroll
let valueY = 0;

function initializedBestScores(){
  bestScoreArray = [
    { questions: 10, bestScore: finalTimeDisplay },
    { questions: 25, bestScore: finalTimeDisplay },
    { questions: 50, bestScore: finalTimeDisplay },
    { questions: 99, bestScore: finalTimeDisplay },
  ];
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
}

function displayBestScores() {
  bestScores.forEach((bestScore, index) => {
    bestScore.textContent = `${bestScoreArray[index].bestScore}s`;
  });
}

function getSavedBestScores() {
  if(localStorage.getItem('bestScores')) {
    bestScoreArray = JSON.parse(localStorage.bestScores);
  } else {
    initializedBestScores();
  }
  displayBestScores();
}

function updateBestScore() {
  bestScoreArray.forEach((score,index) => {
    if(questionAmount == score.questions) {
      const savedScore = Number(bestScoreArray[index].bestScore);
      if(savedScore === 0 || savedScore > finalTime) {
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }
    }
  });
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
  displayBestScores();
  itemContainer.scrollTo({ top : 0, behavior: 'instant'});
}

function resetPlayer(){
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
}

function playAgain() {
  gamePage.addEventListener('click',startTimer);
  scorePage.hidden = true;
  playAgainBtn.hidden = true;
  splashPage.hidden = false;
  resetPlayer();
}

function showScorePage() {
  gamePage.hidden = true;
  scorePage.hidden = false;
  setTimeout(() => {
    playAgainBtn.hidden = false;
  },1000);
}

function formatScores(){
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Base Time : ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
}

function getPenalty(){
  equationsArray.forEach((equation, index) => {
    if(equation.evaluated !== playerGuessArray[index]) {
      penaltyTime += 0.5;
    } 
  });
}

function evaluateResult() {
  getPenalty();
  finalTime = timePlayed + penaltyTime;
  formatScores();
}


function addTime() {
  timePlayed += 0.1;
  if (playerGuessArray.length == questionAmount) {
    stopTimer();
    evaluateResult();
    updateBestScore();
    showScorePage();
  }
}

function resetTime() {
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
}

function startTimer() {
  resetTime();
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener('click', startTimer);
}

function stopTimer(){
  clearInterval(timer);
}

function select(guessedTrue) {
  valueY += 80;
  itemContainer.scroll(0,valueY);
  return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false');

}

// Displays Game Page
function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}

function equationsToDOM(){
  equationsArray.forEach((equation) => {
    
    const item = document.createElement('div');
    item.classList.add('item');
    
    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;
    
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}

function populateGamePage() {
 
  itemContainer.textContent = '';
 
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

function countdownStart(){
  let count = 3;
  countdown.textContent = count;
  const timeCountDown = setInterval(() => {
    count--;
    if(count === 0) {
      countdown.textContent = 'Go!';
    } else if (count === -1) {
        showGamePage();
        clearInterval(timeCountDown);
    } else {
      countdown.textContent = count;
    }
  }, 1000);
}

function showCountdown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  populateGamePage();
  countdownStart();
  
}

// Get the value from selected radio button
function getRadioValue(){
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if(radioInput.checked) {
      radioValue = radioInput.value;
    }
  });
  return radioValue;
}

// Form that decides amount of questions
function selectQuestionAmount(e) {
  e.preventDefault();
  questionAmount = getRadioValue();
  if(questionAmount) {
    showCountdown();
  } 
}

startForm.addEventListener('click', () => {
  radioContainers.forEach((radioEl) => {
    // Remove Selected Label Styling
    radioEl.classList.remove('selected-label');
    // Add it back if radio input is checked
    if(radioEl.children[1].checked) {
      radioEl.classList.add('selected-label');
    }
  });
});

// Event Listeners
startForm.addEventListener('submit', selectQuestionAmount);
gamePage.addEventListener('click', startTimer);

// On Load
getSavedBestScores();
