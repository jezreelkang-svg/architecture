/* =========================================
   TERMS YOU SHOULD KNOW
========================================= */

const TERMS = [

  "Plot Ratio",
  "KM approval",
  "CCC",
  "Defects Liability Period",
  "PAM Contract",
  "Columns",
  "Shop Drawings",
  "Rendering",
  "Housing Development Act",
  "UBBL",
  "Serviced Apartment",
  "COB",
  "Shear Wall",
  "PT Slab",
  "Formwork",
  "G-Forms",
  "Interim Certificate",
  "Modernism",
  "National Land Code",
  "Le Corbusier",
  "Zaha Hadid",
  "Land Title",
  "Coping",
  "Fin Walls",
  "AC Ledge",
  "Accessory Parcel",
  "Common Area",
  "Spray Tiles",
  "Cornice",
  "Skylight",
  "Skirting",
  "Courtyard",
  "Expansion Joints",
  "Railing",
  "Atrium",
  "Airwell",
  "Low-E Glass",
  "PQP",
  "Symmetry",
  "Datum",
  "SPC",
  "Fire Door",
  "Hose Reel",
  "Cantilever",
  "Variation Order",
  "Tender Interview",
  "Reflected Ceiling Plan",
  "Setting Out",
  "Staircase",
  "Building Setback",
  "Land Use",
  "OSD"

];


/* =========================================
   GAME SETTINGS
========================================= */

const ROUND_DURATION = 120;

const DOWN_THRESHOLD = 22;

const UP_THRESHOLD = 22;

const NEUTRAL_THRESHOLD = 10;


/* =========================================
   STATE
========================================= */

let gameTerms = [];

let currentIndex = 0;

let score = 0;

let correctTerms = [];

let passedTerms = [];

let timeRemaining =
  ROUND_DURATION;

let timerInterval = null;

let countdownInterval = null;

let gameActive = false;


/* =========================================
   MOTION
========================================= */

let motionListening = false;

let latestBeta = null;

let neutralBeta = null;

let tiltArmed = true;

let calibrating = false;


/* =========================================
   FULLSCREEN / ORIENTATION
========================================= */

let fullscreenActive = false;


/* =========================================
   DOM
========================================= */

const app =
  document.getElementById("app");

const startScreen =
  document.getElementById(
    "startScreen"
  );

const countdownScreen =
  document.getElementById(
    "countdownScreen"
  );

const gameScreen =
  document.getElementById(
    "gameScreen"
  );

const resultScreen =
  document.getElementById(
    "resultScreen"
  );

const startButton =
  document.getElementById(
    "startButton"
  );

const playAgainButton =
  document.getElementById(
    "playAgainButton"
  );

const correctButton =
  document.getElementById(
    "correctButton"
  );

const passButton =
  document.getElementById(
    "passButton"
  );

const scoreElement =
  document.getElementById(
    "score"
  );

const timerElement =
  document.getElementById(
    "timer"
  );

const timerBar =
  document.getElementById(
    "timerBar"
  );

const currentWordElement =
  document.getElementById(
    "currentWord"
  );

const wordNumberElement =
  document.getElementById(
    "wordNumber"
  );

const progressText =
  document.getElementById(
    "progressText"
  );

const progressFill =
  document.getElementById(
    "progressFill"
  );

const feedbackElement =
  document.getElementById(
    "feedback"
  );

const wordCard =
  document.getElementById(
    "wordCard"
  );

const countdownNumber =
  document.getElementById(
    "countdownNumber"
  );

const finalScoreElement =
  document.getElementById(
    "finalScore"
  );

const correctCountElement =
  document.getElementById(
    "correctCount"
  );

const passedCountElement =
  document.getElementById(
    "passedCount"
  );

const unseenCountElement =
  document.getElementById(
    "unseenCount"
  );

const correctList =
  document.getElementById(
    "correctList"
  );

const passedList =
  document.getElementById(
    "passedList"
  );


/* =========================================
   SCREEN CONTROL
========================================= */

function showScreen(screen) {

  startScreen.classList.remove(
    "active"
  );

  countdownScreen.classList.remove(
    "active"
  );

  gameScreen.classList.remove(
    "active"
  );

  resultScreen.classList.remove(
    "active"
  );

  screen.classList.add(
    "active"
  );
}


/* =========================================
   SHUFFLE
========================================= */

function shuffle(array) {

  const copy = [...array];

  for (
    let i = copy.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() *
        (i + 1)
      );

    [
      copy[i],
      copy[j]
    ] = [
      copy[j],
      copy[i]
    ];
  }

  return copy;
}


/* =========================================
   START BUTTON
========================================= */

startButton.addEventListener(
  "click",
  beginRoundPreparation
);


playAgainButton.addEventListener(
  "click",
  beginRoundPreparation
);


/* =========================================
   BEGIN ROUND
========================================= */

async function beginRoundPreparation() {

  /*
    First attempt fullscreen.
    Browsers require this to happen
    from a user interaction.
  */

  await enterFullscreen();


  /*
    Ask for iPhone motion permission.
  */

  await enableMotion();


  /*
    Attempt native landscape.
  */

  await enterLandscape();


  /*
    Prepare game.
  */

  gameTerms =
    shuffle(TERMS);

  currentIndex = 0;

  score = 0;

  correctTerms = [];

  passedTerms = [];

  timeRemaining =
    ROUND_DURATION;

  gameActive = false;


  scoreElement.textContent =
    "00";

  timerElement.textContent =
    ROUND_DURATION;

  timerBar.style.width =
    "100%";

  feedbackElement.textContent =
    "";


  updateProgress();


  /*
    Show countdown.
  */

  runCountdown();
}


/* =========================================
   3 SECOND COUNTDOWN
========================================= */

function runCountdown() {

  showScreen(
    countdownScreen
  );

  let count = 3;

  countdownNumber.textContent =
    count;


  /*
    Restart CSS animation.
  */

  restartCountdownAnimation();


  countdownInterval =
    setInterval(() => {

      count--;

      if (count > 0) {

        countdownNumber.textContent =
          count;

        restartCountdownAnimation();

        return;
      }


      if (count === 0) {

        countdownNumber.textContent =
          "GO";

        restartCountdownAnimation();

        clearInterval(
          countdownInterval
        );


        setTimeout(() => {

          startActualGame();

        }, 500);
      }

    }, 1000);
}


/* =========================================
   COUNTDOWN ANIMATION
========================================= */

function restartCountdownAnimation() {

  countdownNumber.style.animation =
    "none";

  void countdownNumber.offsetWidth;

  countdownNumber.style.animation =
    "countdownPulse 1s ease-in-out";
}


/* =========================================
   ACTUAL GAME START
========================================= */

function startActualGame() {

  gameActive = true;

  showScreen(gameScreen);

  showCurrentTerm();

  startTimer();

  calibrateTilt();
}


/* =========================================
   CURRENT TERM
========================================= */

function showCurrentTerm() {

  if (
    currentIndex >=
    gameTerms.length
  ) {

    endGame();

    return;
  }


  const term =
    gameTerms[currentIndex];


  currentWordElement.textContent =
    term;


  wordNumberElement.textContent =
    String(
      currentIndex + 1
    ).padStart(2, "0");


  feedbackElement.textContent =
    "";


  updateProgress();
}


/* =========================================
   CORRECT
========================================= */

function markCorrect() {

  if (!gameActive) return;


  const term =
    gameTerms[currentIndex];


  correctTerms.push(term);

  score++;


  scoreElement.textContent =
    String(score).padStart(
      2,
      "0"
    );


  showFeedback(
    "CORRECT"
  );


  animateCard(
    "correct"
  );


  vibrate();


  nextTerm();
}


/* =========================================
   PASS
========================================= */

function markPass() {

  if (!gameActive) return;


  const term =
    gameTerms[currentIndex];


  passedTerms.push(term);


  showFeedback(
    "PASS"
  );


  animateCard(
    "pass"
  );


  vibrate();


  nextTerm();
}


/* =========================================
   NEXT TERM
========================================= */

function nextTerm() {

  currentIndex++;


  if (
    currentIndex >=
    gameTerms.length
  ) {

    endGame();

    return;
  }


  setTimeout(() => {

    if (!gameActive) return;

    showCurrentTerm();

  }, 180);
}


/* =========================================
   FEEDBACK
========================================= */

function showFeedback(message) {

  feedbackElement.textContent =
    message;
}


/* =========================================
   CARD ANIMATION
========================================= */

function animateCard(type) {

  wordCard.classList.remove(
    "answer-correct",
    "answer-pass"
  );


  void wordCard.offsetWidth;


  if (
    type === "correct"
  ) {

    wordCard.classList.add(
      "answer-correct"
    );

  } else {

    wordCard.classList.add(
      "answer-pass"
    );
  }
}


/* =========================================
   TIMER
========================================= */

function startTimer() {

  clearInterval(
    timerInterval
  );


  timerInterval =
    setInterval(() => {

      if (!gameActive) {

        clearInterval(
          timerInterval
        );

        return;
      }


      timeRemaining--;


      timerElement.textContent =
        timeRemaining;


      const percentage =
        (
          timeRemaining /
          ROUND_DURATION
        ) * 100;


      timerBar.style.width =
        `${percentage}%`;


      if (
        timeRemaining <= 0
      ) {

        endGame();
      }

    }, 1000);
}


/* =========================================
   END GAME
========================================= */

async function endGame() {

  if (!gameActive) return;


  gameActive = false;


  clearInterval(
    timerInterval
  );


  clearInterval(
    countdownInterval
  );


  /*
    Exit fullscreen.
  */

  await exitFullscreen();


  /*
    Return to portrait if browser
    supports orientation locking.
  */

  await exitLandscape();


  /*
    Show results.
  */

  renderResults();

  showScreen(
    resultScreen
  );
}


/* =========================================
   RESULTS
========================================= */

function renderResults() {

  finalScoreElement.textContent =
    score;


  correctCountElement.textContent =
    correctTerms.length;


  passedCountElement.textContent =
    passedTerms.length;


  const notReached =
    TERMS.length -
    correctTerms.length -
    passedTerms.length;


  unseenCountElement.textContent =
    Math.max(
      0,
      notReached
    );


  /*
    CORRECT LIST
  */

  correctList.innerHTML = "";


  if (
    correctTerms.length === 0
  ) {

    correctList.innerHTML =
      '<div class="term-item">None</div>';

  } else {

    correctTerms.forEach(
      term => {

        const item =
          document.createElement(
            "div"
          );

        item.className =
          "term-item";

        item.textContent =
          term;

        correctList.appendChild(
          item
        );
      }
    );
  }


  /*
    PASSED LIST
  */

  passedList.innerHTML = "";


  if (
    passedTerms.length === 0
  ) {

    passedList.innerHTML =
      '<div class="term-item">None</div>';

  } else {

    passedTerms.forEach(
      term => {

        const item =
          document.createElement(
            "div"
          );

        item.className =
          "term-item";

        item.textContent =
          term;

        passedList.appendChild(
          item
        );
      }
    );
  }
}


/* =========================================
   PROGRESS
========================================= */

function updateProgress() {

  const answered =
    correctTerms.length +
    passedTerms.length;


  progressText.textContent =
    `${answered} / ${TERMS.length}`;


  const percentage =
    (
      answered /
      TERMS.length
    ) * 100;


  progressFill.style.width =
    `${percentage}%`;
}


/* =========================================
   FULLSCREEN
========================================= */

async function enterFullscreen() {

  try {

    if (
      document.fullscreenElement
    ) {

      fullscreenActive = true;

      return;
    }


    if (
      document.documentElement
        .requestFullscreen
    ) {

      await document.documentElement
        .requestFullscreen();

      fullscreenActive = true;

    }

  } catch (error) {

    console.log(
      "Fullscreen unavailable:",
      error
    );

    fullscreenActive = false;
  }
}


/* =========================================
   EXIT FULLSCREEN
========================================= */

async function exitFullscreen() {

  try {

    if (
      document.fullscreenElement
    ) {

      await document.exitFullscreen();
    }

  } catch (error) {

    console.log(
      "Could not exit fullscreen:",
      error
    );
  }

  fullscreenActive = false;
}


/* =========================================
   LANDSCAPE
========================================= */

async function enterLandscape() {

  /*
    Add visual game mode.
  */

  document.body.classList.add(
    "game-mode"
  );


  /*
    Native screen orientation.
    Works on supported browsers,
    especially when fullscreen is active.
  */

  try {

    if (
      screen.orientation &&
      screen.orientation.lock
    ) {

      await screen.orientation.lock(
        "landscape"
      );

    }

  } catch (error) {

    console.log(
      "Native landscape lock unavailable:",
      error
    );
  }
}


/* =========================================
   EXIT LANDSCAPE
========================================= */

async function exitLandscape() {

  document.body.classList.remove(
    "game-mode"
  );


  try {

    if (
      screen.orientation &&
      screen.orientation.unlock
    ) {

      screen.orientation.unlock();
    }

  } catch (error) {

    console.log(
      "Orientation unlock unavailable:",
      error
    );
  }
}


/* =========================================
   MOTION PERMISSION
========================================= */

async function enableMotion() {

  if (
    typeof DeviceOrientationEvent ===
    "undefined"
  ) {

    return;
  }


  /*
    iOS Safari.
  */

  if (
    typeof DeviceOrientationEvent
      .requestPermission ===
    "function"
  ) {

    try {

      const permission =
        await DeviceOrientationEvent
          .requestPermission();


      if (
        permission !== "granted"
      ) {

        console.log(
          "Motion permission denied."
        );

        return;
      }

    } catch (error) {

      console.log(
        "Motion permission error:",
        error
      );

      return;
    }
  }


  if (!motionListening) {

    window.addEventListener(
      "deviceorientation",
      handleOrientation,
      true
    );

    motionListening = true;
  }
}


/* =========================================
   ORIENTATION SENSOR
========================================= */

function handleOrientation(
  event
) {

  if (!gameActive) return;


  if (
    event.beta === null
  ) {

    return;
  }


  latestBeta =
    event.beta;


  if (calibrating) return;


  if (
    neutralBeta === null
  ) {

    return;
  }


  const delta =
    angleDifference(
      latestBeta,
      neutralBeta
    );


  /*
    Wait until phone returns
    close to neutral before
    accepting another tilt.
  */

  if (!tiltArmed) {

    if (
      Math.abs(delta) <=
      NEUTRAL_THRESHOLD
    ) {

      tiltArmed = true;
    }

    return;
  }


  /*
    DOWN = CORRECT
  */

  if (
    delta >=
    DOWN_THRESHOLD
  ) {

    tiltArmed = false;

    markCorrect();

    return;
  }


  /*
    UP = PASS
  */

  if (
    delta <=
    -UP_THRESHOLD
  ) {

    tiltArmed = false;

    markPass();

    return;
  }
}


/* =========================================
   ANGLE
========================================= */

function angleDifference(
  current,
  base
) {

  let difference =
    current - base;


  while (
    difference > 180
  ) {

    difference -= 360;
  }


  while (
    difference < -180
  ) {

    difference += 360;
  }


  return difference;
}


/* =========================================
   CALIBRATION
========================================= */

function calibrateTilt() {

  neutralBeta = null;

  tiltArmed = true;

  calibrating = true;

  latestBeta = null;


  setTimeout(() => {

    if (
      latestBeta !== null
    ) {

      neutralBeta =
        latestBeta;
    }


    calibrating = false;

  }, 900);
}


/* =========================================
   VIBRATION
========================================= */

function vibrate() {

  if (
    "vibrate" in navigator
  ) {

    navigator.vibrate(40);
  }
}


/* =========================================
   BUTTON CONTROLS
========================================= */

correctButton.addEventListener(
  "click",
  () => {

    if (!gameActive) return;

    tiltArmed = false;

    markCorrect();
  }
);


passButton.addEventListener(
  "click",
  () => {

    if (!gameActive) return;

    tiltArmed = false;

    markPass();
  }
);


/* =========================================
   INITIAL STATE
========================================= */

showScreen(
  startScreen
);
