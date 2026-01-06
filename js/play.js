let guessWord = "";
const keys = ["q", "w", "e", "r", "t", "z", "u", "i", "o", "p", "š", "a", "s", "d", "f", "g", "h", "j", "k", "l", "č", "ž", "Enter", "y", "x", "c", "v", "b", "n", "m", "Backspace"];

const L1 = document.getElementById("L1");
const L2 = document.getElementById("L2");
const L3 = document.getElementById("L3");
const L4 = document.getElementById("L4");
const L5 = document.getElementById("L5");

for (let key of keys) {
  let keyButton = document.createElement("button");
  keyButton.innerHTML = key;
  keyButton.classList.add("keyButton");
  keyButton.addEventListener("click", () => writeGuess(key));

  document.querySelector(".keyboardContainer").appendChild(keyButton);
  if (key == "š" || key == "ž") {
    document.querySelector(".keyboardContainer").appendChild(document.createElement("br"));
  }
}

document.addEventListener("keydown", function (event) {
  writeGuess(event.key);
});

function writeGuess(key) {
  if ("abcčdefghijklmnoprsštuvzžqwyx".includes(key)) {
    if (guessWord.length < 5) {
      guessWord += key;
    }
  }
  if (key == "Backspace") {
    guessWord = guessWord.slice(0, -1);
  }
  if (key == "Enter") {
    guessClick();
    guessWord = "";
  }
  console.log(guessWord);
  L1.innerHTML = guessWord[0] || "";
  L2.innerHTML = guessWord[1] || "";
  L3.innerHTML = guessWord[2] || "";
  L4.innerHTML = guessWord[3] || "";
  L5.innerHTML = guessWord[4] || "";
}

//nastavi višino zgornjega dela ekrana nad tipkovnico
const aboveKeyboard = document.querySelector(".aboveKeyboard");
const keyboard = document.querySelector(".keyboardArea");

function updateAboveKeyboard() {
  const keyboardHeight = keyboard.offsetHeight;

  aboveKeyboard.style.bottom = keyboardHeight + "px";
}

window.addEventListener("resize", updateAboveKeyboard);
updateAboveKeyboard();
