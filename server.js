const http = require("http");
const WebSocket = require("ws");

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const lobbies = {};
wss.on("connection", (ws) => {
  console.log("A player connected");
  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());
    console.log("Received:", data);
    ws.playerName = data.player;
    ws.lobbyID = data.lobbyID;

    if (data.type == "JOIN_LOBBY") {
      if (!lobbies[data.lobbyID]) {
        lobbies[data.lobbyID] = {
          players: new Map(),
          word: "apple", // temporary hardcoded
          finished: false,
        };
      }

      lobbies[data.lobbyID].players.set(ws, {
        name: data.player,
        attempts: [],
        solved: false,
      });
      brodcastToLobby(data.lobbyID, { type: "newPlayer", playerName: data.player, message: "player has joined the lobby" });
    }

    if (data.type == "GUESS") {
      console.log(data.guessWord);
      var wordEvaluation = validateWord(data.guessWord, lobbies[data.lobbyID].word);
      const lobby = lobbies[data.lobbyID];
      const player = lobby.players.get(ws);
      player.attempts.push({
        type: "myGuess",
        word: data.guessWord,
        evaluation: validateWord(data.guessWord, lobbies[data.lobbyID].word),
      });

      ws.send(JSON.stringify(player.attempts));
      console.log(player.attempts);
      attemptsForOthers = [];
      for (attempt of player.attempts) {
        console.log(attempt);
        attemptsForOthers.push(attempt.evaluation);
      }
      brodcastToLobby(data.lobbyID, { type: "newGuess", playerName: data.player, evaluation: attemptsForOthers });
      console.log(data.lobbyID);
      console.log(data.player);
      console.log(attemptsForOthers);
    }
  });
  ws.on("close", () => {
    console.log("A player disconnected");
    console.log(ws.lobbyID);
    if (ws.lobbyID && lobbies[ws.lobbyID]) {
      lobbies[ws.lobbyID].players.delete(ws);

      brodcastToLobby(ws.lobbyID, { type: "playerLeft", playerName: ws.playerName, message: "player has left the lobby" });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`server running on http:/localhost:${PORT}`);
});

function brodcastToLobby(lobbyID, message) {
  const lobby = lobbies[lobbyID];
  if (!lobby) return; // safety guard

  for (const [ws, player] of lobby.players) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }
}

function validateWord(guessWord, trueWord) {
  let evaluation = "";
  let lettersInTrueWord = {};
  for (let i = 0; i < trueWord.length; i++) {
    const trueLetter = trueWord[i];
    if (!lettersInTrueWord[trueLetter]) {
      lettersInTrueWord[trueLetter] = 1;
    } else {
      lettersInTrueWord[trueLetter] += 1;
    }
  }
  for (let i = 0; i < guessWord.length; i++) {
    const guessLetter = guessWord[i];
    const trueLetter = trueWord[i];
    if (guessLetter == trueLetter) {
      lettersInTrueWord[guessLetter] -= 1;
    }
  }

  for (let i = 0; i < guessWord.length; i++) {
    const guessLetter = guessWord[i];
    const trueLetter = trueWord[i];
    if (guessLetter == trueLetter) {
      evaluation += "Z";
    } else if (lettersInTrueWord[guessLetter] >= 1) {
      lettersInTrueWord[guessLetter] -= 1;
      evaluation += "R";
    } else {
      evaluation += "S";
    }
  }

  return evaluation;
}
