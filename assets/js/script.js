
// GIVEN I am taking a code quiz
// WHEN I click the start button
// THEN a timer starts and I am presented with a question
// WHEN I answer a question
// THEN I am presented with another question
// WHEN I answer a question incorrectly
// THEN time is subtracted from the clock
// WHEN all questions are answered or the timer reaches 0
// THEN the game is over
// WHEN the game is over
// THEN I can save my initials and my score

// DOCUMENT SELECTORS
var startBtn = document.querySelector("#start-button");
var timerEl = document.querySelector("#timer");
var mainEl = document.querySelector("#main");
var homeLi = document.querySelector("#home-link");
var highscoreLi = document.querySelector("#highscore-link");

// GLOBAL VARIABLES
var timerInterval;
var secondsLeft;
var quizSelection;
var quizQuestions;
var quizAnswers;

// HTML QUIZ
const htmlQuestions = [
  "What is the full form HTML",
  'The Element of "<title>" must be located inside of .......?',
  "Tag Use to create HyperLink is .......?",
  "Which of the following is used to open a new window?",
  "Is <h4> the largest default heading tag.",
  "Which tags is used to create a table row?",
  "Which of the following tags is NOT Correct?",
  "Which of the following is NOT an example of HTML attribute?",
  "What HTML form input must be used to present multiple options but the user is only allowed to select one",
];
const htmlAnswers = [
  [
    ["Hyper Text Markup Language", true],
    ["Hot Mail", false],
    ["How to Make Lasagna", false],
  ],
  [
    ["the <head> element", true],
    ["the <body> element", false],
  ],
  [
    ["<a>", true],
    ["<img>", false],
    ["<dl>", false],
    ["<link>", false],
  ],
  [
    ['target="_new"', false],
    ['target="_window"', false],
    ['target="_blank"', true],
  ],
  [
    ["True", false],
    ["False", true],
  ],
  [
    ["<th>", false],
    ["<td>", false],
    ["<tr>", true],
    ["<table>", false],
  ],
  [
    ["<h1>", false],
    ["<h8>", true],
    ["<h4>", false],
    ["<h5>", false],
  ],
  [
    ["alt", false],
    ["target", false],
    ["fontSize", true],
    ["id", false],
  ],
  [
    ['<input type="text">', false],
    ['<input type="radio">', true],
    ['<input type="checkbox">', false],
  ],
];

// JS QUIZ

// runs on page load
function init() {
  renderHome();
}

// NAVBAR //
homeLi.addEventListener("click", renderHome);
highscoreLi.addEventListener("click", renderScoreboard);

function initializeTimer() {
  secondsLeft = 75;

  if (!timerInterval) {
    timerInterval = setInterval(function () {
      secondsLeft--;
      timerEl.textContent = secondsLeft;

      if (secondsLeft <= 0) {
        endQuiz();
      }
    }, 1000);
  }
}

function stopTime() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  secondsLeft = 0;
  timerEl.textContent = secondsLeft;
}

// HOMEPAGE RENDERING //
function renderHome() {
  resetQuiz();
  // check if timer is initialized
  if (timerInterval) {
    stopTime();
  }

  mainEl.textContent = "";

  renderTitle("Coding Quiz Challenge");

  let par = document.createElement("p");
  par.textContent =
    "Select a category below for the language you would like to take a quiz on. You will have 75 seconds to complete all 9 questions! At the end, enter your initials to be added to the leaderboard.";

  let categoryDiv = document.createElement("div");
  categoryDiv.classList.add("selection-div");

  let categoryLabel = document.createElement("label");
  categoryLabel.textContent = "Select a Category:";

  let categorySelect = document.createElement("select");
  categorySelect.setAttribute("id", "quiz-select");

  categorySelect.appendChild(createChoice("HTML Basics"));

  categoryDiv.appendChild(categoryLabel);
  categoryDiv.appendChild(categorySelect);

  let startButton = document.createElement("button");
  startButton.textContent = "Start Quiz!";
  startButton.setAttribute("id", "start-button");
  startButton.addEventListener("click", startQuiz);

  mainEl.appendChild(par);
  mainEl.appendChild(categoryDiv);
  mainEl.appendChild(startButton);
}

function createChoice(choiceName) {
  let choice = document.createElement("option");
  choice.textContent = choiceName;
  return choice;
}

// HIGHSCORE PAGE RENDERING
function renderScoreboard() {
  mainEl.textContent = "";
  resetQuiz();

  // check if timer is initialized
  if (timerInterval) {
    stopTime();
  }

  let scoreboard = JSON.parse(localStorage.getItem("scoreboard"));

  renderTitle("Leaderboard");

  if (!scoreboard) {
    let par = document.createElement("p");
    par.textContent =
      "It looks like there are no high scores yet! Will you be the first one?";
    mainEl.appendChild(par);

    let button = document.createElement("button");
    button.textContent = "Back to Home";
    button.addEventListener("click", renderHome);
    mainEl.appendChild(button);

    return;
  }

  let playerUl = document.createElement("ul");
  playerUl.classList.add("scoreboard-list");

  for (let i = 0; i < scoreboard.length; i++) {
    let playerLi = document.createElement("li");
    playerLi.classList.add("scoreboard-item");
    playerLi.textContent = `${scoreboard[i].name} -- ${scoreboard[i].score}`;
    playerUl.appendChild(playerLi);
  }

  let homeButton = document.createElement("button");
  homeButton.textContent = "Back to Home";
  homeButton.addEventListener("click", renderHome);

  let resetButton = document.createElement("button");
  resetButton.textContent = "Reset Highscores";
  resetButton.addEventListener("click", function () {
    localStorage.clear();
    renderScoreboard();
  });

  mainEl.appendChild(playerUl);
  mainEl.appendChild(homeButton);
  mainEl.appendChild(resetButton);
}

function addHighScore() {
  let scoreboard = JSON.parse(localStorage.getItem("scoreboard"));

  // validation of empty scoreboard
  if (scoreboard == null) {
    scoreboard = [];
  }

  let playerName = document
    .getElementById("initials-input")
    .value.toUpperCase();
  let playerScore = secondsLeft;

  let player = {
    name: playerName,
    score: playerScore,
  };

  // push player object onto localStorage array, then sort array highest to lowest
  scoreboard.push(player);
  scoreboard.sort((a, b) => b.score - a.score);
  localStorage.setItem("scoreboard", JSON.stringify(scoreboard));
}

// QUIZ RENDERING + HANDLING

// sets questions based on home selection, starts timer, and prints the first question
function startQuiz() {
  setQuiz();
  mainEl.textContent = "";
  initializeTimer();
  renderQuestion();
}

// sets quizQuestions + quizAnswers as the chosen array
function setQuiz() {
  quizSelection = document.querySelector("#quiz-select").value;

  if (quizSelection === "HTML Basics") {
    quizQuestions = JSON.parse(JSON.stringify(htmlQuestions));
    quizAnswers = JSON.parse(JSON.stringify(htmlAnswers));
  } else {
    quizQuestions = JSON.parse(JSON.stringify(questions));
    quizAnswers = JSON.parse(JSON.stringify(answers));
  }
}

function resetQuiz() {
  quizQuestions = null;
  quizAnswers = null;
  resetTimer();
}

function endQuiz() {
  if (secondsLeft < 0) {
    secondsLeft = 0;
    timerEl.textContent = secondsLeft;
  }
  stopTime();

  let affirmations = [
    "Keep it up, pal!",
    "You're doing great!",
    "I bet you could do this with your eyes closed!",
    "I'm sure everyone would be impressed if they saw you take this quiz!",
    "Steve Jobs? Is that you?!",
    "Excelsior!",
  ];

  let pageTitle = document.createElement("h1");
  pageTitle.textContent = "Quiz Over!";

  let quizResults = document.createElement("p");
  quizResults.textContent = `You scored ${secondsLeft} points. ${
    affirmations[randomNumber(affirmations.length)]
  }`;

  let initialsPrompt = document.createElement("p");
  initialsPrompt.textContent = "Please enter your initials:";
  initialsPrompt.classList.add("enter-initials");

  let initialsInput = document.createElement("input");
  initialsInput.classList.add("initials-input");
  initialsInput.setAttribute("id", "initials-input");
  initialsInput.maxLength = 15;
  initialsInput.size = 15;

  let highscoreButton = document.createElement("button");
  highscoreButton.textContent = "Go to Highscores";

  highscoreButton.addEventListener("click", function () {
    if (initialsInput.value) {
      addHighScore();
      resetQuiz();
      renderScoreboard();
    }
  });

  mainEl.textContent = "";

  mainEl.appendChild(pageTitle);
  mainEl.appendChild(quizResults);
  mainEl.appendChild(initialsPrompt);
  mainEl.appendChild(initialsInput);
  mainEl.appendChild(highscoreButton);
}

function renderQuestion() {
  // check if there are any remaining questions
  if (quizQuestions.length === 0) {
    return endQuiz();
  }

  mainEl.textContent = "";

  let card = document.createElement("div");
  card.classList.add("card");

  let icon = document.createElement("i");
  icon.classList.add("fas");
  icon.classList.add("fa-question-circle");
  icon.classList.add("fa-4x");
  card.appendChild(icon);

  // generate a random number based on the number of questions available
  randomNum = randomNumber(quizQuestions.length);

  card.appendChild(renderQuestionTitle(quizQuestions[randomNum]));

  let listOptions = document.createElement("ol");

  // print questions depending on how many there are for that question
  for (let i = 0; i < quizAnswers[randomNum].length; i++) {
    listOptions.appendChild(createAnswerChoice(randomNum, i));
  }

  card.appendChild(listOptions);

  mainEl.appendChild(card);
}

function createAnswerChoice(randomNum, index) {
  let answer = document.createElement("li");

  answer.classList.add("answer-choice");
  answer.addEventListener("click", checkAnswer);
  answer.textContent = quizAnswers[randomNum][index][0];
  answer.dataset.answer = quizAnswers[randomNum][index][1];

  return answer;
}

function checkAnswer() {
  // check to see if the answer is correct, then remove it from its array
  if (this.dataset.answer === "true") {
    this.classList.add("correct");

    quizQuestions.splice(randomNum, 1);
    quizAnswers.splice(randomNum, 1);

    setTimeout(renderQuestion, 500);
  } else {
    // notify user of wrong answer, then add 10 second penalty
    if (!this.textContent.endsWith("❌")) {
      this.textContent = `${this.textContent} ❌`;
      secondsLeft -= 10;
    }
  }
}

// UTILITY
function randomNumber(max) {
  return Math.floor(Math.random() * max);
}

function renderTitle(titleContent) {
  let title = document.createElement("h1");
  title.textContent = titleContent;
  title.classList.add("page-title");

  mainEl.appendChild(title);
}

function renderQuestionTitle(titleContent) {
  let title = document.createElement("h2");
  title.textContent = titleContent;
  title.classList.add("question-title");

  return title;
}

init();
