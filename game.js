const WORDS = {
  movies: ["Titanic","Frozen","Avatar","Harry Potter","Toy Story","Jurassic Park","The Lion King","Spider-Man","Batman","Finding Nemo"],
  food: ["Pizza","Sushi","Burger","Nasi Lemak","Satay","Ramen","Ice Cream","Durian","Fried Chicken","Pancakes"],
  animals: ["Elephant","Penguin","Giraffe","Kangaroo","Dolphin","Crocodile","Panda","Monkey","Tiger","Rabbit"],
  places: ["Paris","Tokyo","Bali","New York","London","Kuala Lumpur","Mount Everest","Disneyland","Beach","Airport"]
};

const $ = id => document.getElementById(id);
let deck = [], score = 0, timeLeft = 60, duration = 60, timerId = null;
let lastTilt = 0, motionEnabled = false;

function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
}

function makeDeck(category) {
  const source = category === "mixed" ? Object.values(WORDS).flat() : WORDS[category];
  deck = [...source].sort(() => Math.random() - .5);
}

function nextCard() {
  if (!deck.length) makeDeck($("category").value);
  $("word").textContent = deck.pop();
}

function startGame() {
  duration = Number($("duration").value);
  timeLeft = duration;
  score = 0;
  $("score").textContent = score;
  $("timer").textContent = timeLeft;
  $("progressBar").style.width = "100%";
  const category = $("category").value;
  $("categoryLabel").textContent = category.toUpperCase();
  makeDeck(category);
  nextCard();
  show("game");
  clearInterval(timerId);
  timerId = setInterval(() => {
    timeLeft--;
    $("timer").textContent = timeLeft;
    $("progressBar").style.width = `${Math.max(0, timeLeft / duration * 100)}%`;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function correct() {
  score++;
  $("score").textContent = score;
  flash("CORRECT!");
  nextCard();
}

function pass() {
  flash("PASS");
  nextCard();
}

function flash(text) {
  $("word").textContent = text;
  setTimeout(() => {
    if ($("game").classList.contains("active")) nextCard();
  }, 180);
}

function endGame() {
  clearInterval(timerId);
  $("finalScore").textContent = score;
  $("resultMessage").textContent =
    score >= 10 ? "🔥 Excellent!" :
    score >= 5 ? "👏 Nice round!" : "Keep practising!";
  show("results");
}

async function enableMotion() {
  try {
    if (typeof DeviceOrientationEvent === "undefined") {
      throw new Error("Motion sensors are not supported.");
    }
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission !== "granted") throw new Error("Motion permission was not granted.");
    }
    window.addEventListener("deviceorientation", handleOrientation);
    motionEnabled = true;
    $("motionBtn").textContent = "📱 TILT CONTROLS ON";
    $("motionStatus").textContent = "Tilt down = correct • Tilt up = pass";
  } catch (e) {
    $("motionStatus").textContent = "Tilt controls unavailable. Use the buttons.";
  }
}

function handleOrientation(e) {
  if (!motionEnabled || !$("game").classList.contains("active")) return;
  const now = Date.now();
  if (now - lastTilt < 900) return;

  // Beta: front/back tilt. Adjust these thresholds if your phone orientation differs.
  const beta = e.beta ?? 0;
  if (beta > 55) {
    lastTilt = now;
    correct();
  } else if (beta < -25) {
    lastTilt = now;
    pass();
  }
}

$("startBtn").addEventListener("click", startGame);
$("correctBtn").addEventListener("click", correct);
$("passBtn").addEventListener("click", pass);
$("motionBtn").addEventListener("click", enableMotion);
$("againBtn").addEventListener("click", startGame);
$("homeBtn").addEventListener("click", () => show("home"));
