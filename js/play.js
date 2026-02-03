let guessWord = "";
const keys = ["q", "w", "e", "r", "t", "z", "u", "i", "o", "p", "š", "a", "s", "d", "f", "g", "h", "j", "k", "l", "č", "ž", "Enter", "y", "x", "c", "v", "b", "n", "m", "⌫"];

const L1 = document.getElementById("L1");
const L2 = document.getElementById("L2");
const L3 = document.getElementById("L3");
const L4 = document.getElementById("L4");
const L5 = document.getElementById("L5");

for (let key of keys) {
  let keyButton = document.createElement("button");
  keyButton.innerHTML = key;
  keyButton.classList.add("keyButton");
  keyButton.id = "button" + key;
  keyButton.addEventListener("click", () => writeGuess(key));

  document.querySelector(".keyboardContainer").appendChild(keyButton);
  if (key == "š" || key == "ž") {
    document.querySelector(".keyboardContainer").appendChild(document.createElement("br"));
  }
}

document.addEventListener("keydown", function (event) {
  const chatInput = document.getElementById("inputChatBox");
  if (document.activeElement === chatInput) {
    return;
  }
  writeGuess(event.key);
});

function writeGuess(key) {
  if ("abcčdefghijklmnoprsštuvzžqwyx".includes(key)) {
    if (guessWord.length < 5) {
      guessWord += key;
    }
  }
  if (key == "⌫") {
    guessWord = guessWord.slice(0, -1);
  }
  if (key == "Enter") {
    guessClick();
    guessWord = "";
  }
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
let finnished = false;
console.log(finnished);
function guessClick() {
  if (guessWord.length != 5) {
    console.log("the word needs 5 letters");
  } else if (finnished == false) {
    ws.send(
      JSON.stringify({
        type: "GUESS",
        player: playerName,
        lobbyID: lobbyID,
        guessWord: guessWord,
      }),
    );
  }
}

let lettersByColors = {
  green: [],
  yellow: [],
  grey: [],
};

function updateLeaderboard(players) {
  document.querySelector(".aboveKeyboardRight").innerHTML = "";
  for (const player of players) {
    const playerName2 = player.playerName;
    if (playerName == playerName2) {
      continue;
    }
    const atempts = player.evaluations;
    const playerDiv = document.createElement("div");
    playerDiv.id = "player_" + playerName2;
    playerDiv.classList.add("playerDiv");
    const playerNameDiv = document.createElement("div");
    playerNameDiv.classList.add("playerNameDiv");
    playerNameDiv.innerHTML = playerName2;
    const atemptsDiv = document.createElement("div");
    atemptsDiv.id = "atemptsDiv_" + playerName2;
    atemptsDiv.classList.add("atemptsDiv");
    for (const atempt of atempts) {
      const atemptDiv = document.createElement("div");
      atemptDiv.classList.add("atemptDiv");
      for (const l of atempt) {
        const block = document.createElement("div");
        block.classList.add("mini");
        if (l == "S") {
          block.classList.add("greyMini");
        } else if (l == "Z") {
          block.classList.add("greenMini");
        } else if (l == "R") {
          block.classList.add("yellowMini");
        }
        atemptDiv.appendChild(block);
      }
      atemptsDiv.appendChild(atemptDiv);
    }

    playerDiv.appendChild(playerNameDiv);
    playerDiv.appendChild(atemptsDiv);
    document.querySelector(".aboveKeyboardRight").appendChild(playerDiv);
  }
}

function updateLeaderboard2(msg) {
  const playerName2 = msg.playerName;
  if (playerName == playerName2) {
    return;
  }
  const evaluations = msg.evaluation;
  const playerScore = document.getElementById("atemptsDiv_" + playerName2);
  const atemptDiv = document.createElement("div");
  atemptDiv.classList.add("atemptDiv");
  for (const l of evaluations[evaluations.length - 1]) {
    const block = document.createElement("div");
    block.classList.add("mini");
    if (l == "S") {
      block.classList.add("greyMini");
    } else if (l == "Z") {
      block.classList.add("greenMini");
    } else if (l == "R") {
      block.classList.add("yellowMini");
    }
    atemptDiv.appendChild(block);
  }
  playerScore.appendChild(atemptDiv);
}

function removePlayer(msg) {
  const playerName2 = msg.playerName;
  document.getElementById("player_" + playerName2).remove();
}

const chatInput = document.getElementById("inputChatBox");
chatInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();

    const message = playerName + ": " + chatInput.value;
    chatInput.value = "";
    ws.send(
      JSON.stringify({
        type: "MESSAGE",
        player: playerName,
        lobbyID: lobbyID,
        message: message,
      }),
    );
  }
});

function writeInChat(message) {
  const messageDiv = document.createElement("div");
  messageDiv.innerHTML = message;
  document.getElementById("outputChatBox").appendChild(messageDiv);
}

function guessedCorrectly(numberOfGuesses) {
  const message = playerName + " guessed correctly in " + String(numberOfGuesses) + " guess(es).";
  console.log(message);
  ws.send(
    JSON.stringify({
      type: "MESSAGE",
      player: playerName,
      lobbyID: lobbyID,
      message: message,
    }),
  );

  document.querySelector(".aboveKeyboardCenter").classList.add("block");
  finnished = true;
}

function hideChat() {
  document.querySelector(".aboveKeyboardLeft").classList.toggle("hidden");
}

function hideLeaderboard() {
  document.querySelector(".aboveKeyboardRight").classList.toggle("hidden");
}
