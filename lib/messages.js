const terminal = require("terminal-kit").terminal;
const { data } = require("./table");

function explainGame() {
  terminal("Guess the WORDLE in six tries\n");
  terminal(
    "Each guess must be a valid five-letter word. \nHit the enter button to submit.\n"
  );
  terminal(
    "After each guess, the color of the tiles will change to show how close your guess was to the word.\n"
  );
}

function chancesOver(word) {
  terminal.red("\nSorry you had only " + data.totalChances + " chances");
  terminal.red("\nYou lost! The word was " + word + "\n");
}

module.exports = {
  explainGame,
  chancesOver,
};
