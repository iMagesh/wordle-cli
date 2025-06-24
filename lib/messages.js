const terminal = require("terminal-kit").terminal;

function explainGame() {
  terminal.bold("\nWelcome to Wordle CLI!\n");
  terminal("Guess the 5-letter word in 6 tries.\n");
  terminal("Green = correct letter & position, Yellow = correct letter, wrong position, White = not in word.\n\n");
}

function chancesOver(word) {
  terminal.bold.red("\nNO MORE CHANCES! GAME OVER.\n");
  terminal.red("The wordle was '%s'\n", word);
}

module.exports = {
  explainGame,
  chancesOver,
};
