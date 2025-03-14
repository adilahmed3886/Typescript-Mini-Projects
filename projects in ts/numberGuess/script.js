// Game configuration
const GAME_CONFIG = {
  maxAttempts: 7,
  warningThreshold: 2,
  minNumber: 1,
  maxNumber: 100,
  colorChangeInterval: 100,
};

// DOM Elements
const elements = {
  input: document.querySelector(".guess"),
  button: document.querySelector("button"),
  response: document.querySelector(".response-text"),
  guesses: document.querySelector(".guesses"),
  attempts: document.querySelector(".attempts"),
};

// Validate DOM elements
Object.entries(elements).forEach(([key, element]) => {
  if (!element) throw new Error(`Required element "${key}" not found`);
});

// Game state
const gameState = {
  randomNumber: generateRandomNumber(),
  attemptsNumber: GAME_CONFIG.maxAttempts,
  guessesArray: [],
  colorIntervalId: null,
};

// Initialize game
function initializeGame() {
  updateDisplay();
  elements.attempts.textContent = gameState.attemptsNumber;
}

// Utility functions
function generateRandomNumber() {
  return (
    Math.floor(
      Math.random() * (GAME_CONFIG.maxNumber - GAME_CONFIG.minNumber + 1)
    ) + GAME_CONFIG.minNumber
  );
}

function getRandomColor() {
  const colors = [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "orange",
    "pink",
    "brown",
    "gray",
    "black",
    "white",
    "gold",
    "silver",
    "teal",
    "lime",
    "maroon",
    "navy",
    "olive",
    "turquoise",
    "violet",
    "zinc",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function updateDisplay() {
  elements.guesses.textContent = gameState.guessesArray.join(", ");
  elements.attempts.textContent = gameState.attemptsNumber;
}

function clearIntervals() {
  if (gameState.colorIntervalId) {
    clearInterval(gameState.colorIntervalId);
    gameState.colorIntervalId = null;
  }
}

function resetGame() {
  clearIntervals();
  elements.response.textContent = "";
  elements.input.value = "";
  gameState.randomNumber = generateRandomNumber();
  gameState.attemptsNumber = GAME_CONFIG.maxAttempts;
  gameState.guessesArray = [];
  elements.button.innerText = "Guess";
  elements.response.classList.remove("green", "red");
  elements.attempts.classList.remove("red");
  updateDisplay();
}

function handleWin() {
  elements.response.textContent = "YOU GUESSED THE NUMBER!";
  elements.response.classList.remove("green", "red");
  elements.response.style.color = ""; // Reset any inline color
  gameState.colorIntervalId = setInterval(() => {
    elements.response.style.color = getRandomColor();
  }, GAME_CONFIG.colorChangeInterval);
  elements.button.innerText = "Play Again";
}

function handleGameOver() {
  elements.response.textContent = "GAME OVER!";
  elements.button.innerText = "Play Again";
  gameState.attemptsNumber = 0;
  updateDisplay();
  elements.attempts.classList.remove("red");
}

function checkGuess(guess) {
  if (!guess) return;

  const numGuess = Number(guess);
  if (isNaN(numGuess)) {
    elements.response.textContent = "Please enter a valid number!";
    elements.response.classList.remove("green", "red");
    elements.response.style.color = ""; // Reset any inline color
    return false;
  }

  // Check if number is within valid range
  if (numGuess < GAME_CONFIG.minNumber || numGuess > GAME_CONFIG.maxNumber) {
    elements.response.textContent = `Please enter a number between ${GAME_CONFIG.minNumber} and ${GAME_CONFIG.maxNumber}!`;
    elements.response.classList.remove("green", "red");
    elements.response.style.color = ""; // Reset any inline color
    return false;
  }

  if (numGuess === gameState.randomNumber) {
    handleWin();
  } else if (numGuess < gameState.randomNumber) {
    elements.response.textContent = "TOO LOW!";
    elements.response.classList.remove("red");
    elements.response.classList.add("green");
    elements.response.style.color = ""; // Reset any inline color
  } else {
    elements.response.textContent = "TOO HIGH!";
    elements.response.classList.remove("green");
    elements.response.classList.add("red");
    elements.response.style.color = ""; // Reset any inline color
  }
  return true;
}

// Event Handlers
function handleGuess() {
  const guess = elements.input.value.trim();

  if (!guess) {
    elements.response.textContent = "Please enter a number!";
    elements.response.classList.remove("green", "red");
    return;
  }

  if (gameState.guessesArray.includes(guess)) {
    elements.response.textContent = "You already guessed that number!";
    elements.response.classList.remove("green", "red");
    return;
  }

  // Decrease attempts first
  if (gameState.attemptsNumber > 1) {
    gameState.attemptsNumber--;
    if (gameState.attemptsNumber <= GAME_CONFIG.warningThreshold) {
      elements.attempts.classList.add("red");
    }
  } else {
    handleGameOver();
    return;
  }

  if (!checkGuess(guess)) {
    return;
  }

  gameState.guessesArray.push(guess);
  updateDisplay();
}

function handleButtonClick() {
  if (elements.button.innerText === "Guess") {
    handleGuess();
  } else {
    resetGame();
  }
  elements.input.value = "";
}

// Event Listeners
elements.button.addEventListener("click", handleButtonClick);
elements.input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleButtonClick();
});

// Initialize the game
initializeGame();
