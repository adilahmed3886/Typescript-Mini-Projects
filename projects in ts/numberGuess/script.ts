// Types and Enums
enum ButtonState {
  GUESS = "Guess",
  PLAY_AGAIN = "Play again",
}

enum GameState {
  PLAYING = "playing",
  WON = "won",
  GAME_OVER = "game_over",
}

enum CssClass {
  RED = "red",
  GREEN = "green",
}

// Constants
const MESSAGES = {
  INITIAL: "Add a guess!",
  WIN: "YOU GUESSED THE NUMBER!",
  GAME_OVER: "Game Over",
  TOO_HIGH: "TOO HIGH!",
  TOO_LOW: "TOO LOW!",
  INVALID_NUMBER: "Please enter a valid number",
  DUPLICATE_GUESS: "This number is already guessed",
  NUMBER_TOO_HIGH: "Enter a number lower than 100",
  NUMBER_TOO_LOW: "Enter a number higher than 0",
} as const;

interface GameConfiguration {
  maxAttempts: number;
  warningThreshold: number;
  minNumber: number;
  maxNumber: number;
  colorChangeInterval: number;
}

interface GameStateInterface {
  randomNumber: number;
  attemptsNumber: number;
  guessesArray: number[];
  colorIntervalId: number | null;
  currentState: GameState;
}

interface GameElements {
  input: HTMLInputElement;
  button: HTMLButtonElement;
  response: HTMLHeadingElement;
  guesses: HTMLSpanElement;
  attempts: HTMLSpanElement;
}

// Game configuration
const GAME_CONFIG: Readonly<GameConfiguration> = {
  maxAttempts: 7,
  warningThreshold: 3,
  minNumber: 1,
  maxNumber: 100,
  colorChangeInterval: 100,
};

// DOM Elements with null checks
const elements: GameElements = {
  input: document.querySelector(".guess") as HTMLInputElement,
  button: document.querySelector("button") as HTMLButtonElement,
  response: document.querySelector(".response-text") as HTMLHeadingElement,
  guesses: document.querySelector(".guesses") as HTMLSpanElement,
  attempts: document.querySelector(".attempts") as HTMLSpanElement,
};

// Validate DOM elements
Object.entries(elements).forEach(([key, element]) => {
  if (!element) throw new Error(`Required element "${key}" not found`);
});

// Game state with type safety
const gameState: GameStateInterface = {
  randomNumber: generateRandomNumber(),
  attemptsNumber: GAME_CONFIG.maxAttempts,
  guessesArray: [],
  colorIntervalId: null,
  currentState: GameState.PLAYING,
};

function generateRandomNumber(): number {
  return (
    Math.floor(
      Math.random() * (GAME_CONFIG.maxNumber - GAME_CONFIG.minNumber + 1)
    ) + GAME_CONFIG.minNumber
  );
}

function getRandomColor(): string {
  const colors = [
    "red",
    "green",
    "blue",
    "yellow",
    "purple",
    "orange",
    "pink",
    "brown",
    "gray",
    "black",
  ] as const;
  return colors[Math.floor(Math.random() * colors.length)];
}

function updateDisplay(): void {
  elements.response.textContent = MESSAGES.INITIAL;
  elements.guesses.textContent = gameState.guessesArray.join(", ");
  elements.attempts.textContent = gameState.attemptsNumber.toString();
}

function clearIntervals(): void {
  if (gameState.colorIntervalId) {
    clearInterval(gameState.colorIntervalId);
    gameState.colorIntervalId = null;
  }
}

function resetGame(): void {
  clearIntervals();
  elements.response.innerText = MESSAGES.INITIAL;
  elements.input.value = "";
  gameState.attemptsNumber = GAME_CONFIG.maxAttempts;
  gameState.guessesArray = [];
  gameState.randomNumber = generateRandomNumber();
  gameState.currentState = GameState.PLAYING;
  elements.button.innerText = ButtonState.GUESS;
  elements.response.classList.remove(CssClass.RED, CssClass.GREEN);
  elements.attempts.classList.remove(CssClass.RED);
  updateDisplay();
}

function handleWin(): void {
  gameState.currentState = GameState.WON;
  elements.response.innerText = MESSAGES.WIN;
  elements.response.classList.remove(CssClass.RED, CssClass.GREEN);
  elements.response.style.color = "";
  gameState.colorIntervalId = window.setInterval(() => {
    elements.response.style.color = getRandomColor();
  }, GAME_CONFIG.colorChangeInterval);
  elements.button.innerText = ButtonState.PLAY_AGAIN;
}

function handleGameOver(): void {
  gameState.currentState = GameState.GAME_OVER;
  elements.response.innerText = MESSAGES.GAME_OVER;
  elements.button.innerText = ButtonState.PLAY_AGAIN;
  gameState.attemptsNumber = 0;
  elements.attempts.classList.remove(CssClass.RED);
  updateDisplay();
}

function isValidGuess(guess: number): boolean {
  if (isNaN(guess)) {
    elements.response.innerText = MESSAGES.INVALID_NUMBER;
    elements.response.classList.remove(CssClass.RED, CssClass.GREEN);
    return false;
  }

  if (guess > GAME_CONFIG.maxNumber) {
    elements.response.innerText = MESSAGES.NUMBER_TOO_HIGH;
    elements.response.classList.remove(CssClass.RED, CssClass.GREEN);
    return false;
  }

  if (guess < GAME_CONFIG.minNumber) {
    elements.response.innerText = MESSAGES.NUMBER_TOO_LOW;
    elements.response.classList.remove(CssClass.RED, CssClass.GREEN);
    return false;
  }

  return true;
}

function checkGuess(guess: number): boolean {
  if (!isValidGuess(guess)) return false;

  if (guess === gameState.randomNumber) {
    handleWin();
    return true;
  }

  if (guess < gameState.randomNumber) {
    elements.response.innerText = MESSAGES.TOO_LOW;
    elements.response.classList.remove(CssClass.RED);
    elements.response.classList.add(CssClass.GREEN);
  } else {
    elements.response.innerText = MESSAGES.TOO_HIGH;
    elements.response.classList.remove(CssClass.GREEN);
    elements.response.classList.add(CssClass.RED);
  }

  return true;
}

function handleGuess(): void {
  const guessStr = elements.input.value;
  const guess = Number(guessStr);

  if (!guessStr) {
    elements.response.innerText = MESSAGES.INVALID_NUMBER;
    elements.response.classList.remove(CssClass.RED, CssClass.GREEN);
    return;
  }

  if (gameState.guessesArray.includes(guess)) {
    elements.response.innerText = MESSAGES.DUPLICATE_GUESS;
    elements.response.classList.remove(CssClass.RED, CssClass.GREEN);
    return;
  }

  if (!isValidGuess(guess)) return;

  if (gameState.attemptsNumber > 1) {
    gameState.attemptsNumber--;
    if (gameState.attemptsNumber <= GAME_CONFIG.warningThreshold) {
      elements.attempts.classList.add(CssClass.RED);
    }
  } else {
    handleGameOver();
    return;
  }

  if (!checkGuess(guess)) return;

  gameState.guessesArray.push(guess);
  updateDisplay();
}

function handleButtonClick(): void {
  if (elements.button.innerText === ButtonState.GUESS) {
    handleGuess();
  } else {
    resetGame();
  }
  elements.input.value = "";
}

// Event Listeners with proper types
elements.button.addEventListener("click", handleButtonClick);
elements.input.addEventListener("keypress", (e: KeyboardEvent): void => {
  if (e.key === "Enter") handleButtonClick();
});

// Initialize game
function initializeGame(): void {
  updateDisplay();
  elements.attempts.innerText = gameState.attemptsNumber.toString();
  console.log("Random number for debugging:", gameState.randomNumber);
}

initializeGame();
