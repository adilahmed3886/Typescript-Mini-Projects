const input = document.querySelector(".guess");
const button = document.querySelector("button");
const response = document.querySelector(".response-text");
const guesses = document.querySelector(".guesses");
const attempts = document.querySelector(".attempts");

let randomNumber = Math.floor(Math.random() * 100) + 1;
let colorIntervalId = null;
let attemptsNumber = 10;
attempts.textContent = attemptsNumber;
let guessesArray = [];

function textColor() {
  const array = [
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
    "purple",
    "teal",
    "turquoise",
    "violet",
    "yellow",
    "zinc",
  ];
  let randomColorNumber = Math.floor(Math.random() * array.length);
  color = array[randomColorNumber];
  console.log(color);
  return color;
}

function resetGame() {
  response.textContent = "";
  input.value = "";
  randomNumber = Math.floor(Math.random() * 100) + 1;
  button.innerText = "Guess";
  if (colorIntervalId) {
    clearInterval(colorIntervalId);
    colorIntervalId = null;
  }
  response.classList.remove("green", "red");
  attempts.classList.remove("red");
}

function checkGuess(input) {
  if (input) {
    if (input === randomNumber) {
      response.textContent = "YOU GUESSED THE NUMBER!";
      colorIntervalId = setInterval(() => {
        response.style.color = textColor();
      }, 100);
      button.innerText = "Play Again";
    } else if (input < randomNumber) {
      response.textContent = "TOO LOW!";
      response.classList.remove("red");
      response.classList.add("green");
    } else if (input > randomNumber) {
      response.textContent = "TOO HIGH!";
      response.classList.remove("green");
      response.classList.add("red");
    }
  }
}

function displayResponse() {}
function displayGuesses() {}
function displayAttempts() {}

button.addEventListener("click", () => {
  if (button.innerText === "Guess") {
    if (guessesArray.includes(input.value)){
        response.textContent = "You already guessed that number!";
        return;
    }
    if (!input.value) return;

    guessesArray.push(input.value);
    guesses.textContent = guessesArray.join(", ");

    if (attemptsNumber > 1) {
      attemptsNumber--;
      attempts.textContent = attemptsNumber;
      checkGuess(Number(input.value));

      if (attemptsNumber <= 4) {
        attempts.classList.add("red");
      }
    } else {
      response.textContent = "GAME OVER!";
      button.innerText = "Play Again";
      attemptsNumber = 0;
      attempts.textContent = attemptsNumber;
      attempts.classList.remove("red");
    }
  } else if (button.innerText === "Play Again") {
    guessesArray = [];
    guesses.textContent = "";
    attemptsNumber = 10;
    attempts.textContent = attemptsNumber;
    resetGame();
  }
  input.value = "";
});
