const terminal = require("terminal-kit").terminal;

function explainGame() {
  const msg1 = "Welcome to Wordle CLI!";
  const msg2 = "Guess the 5-letter word in 6 tries.";
  const msg3 = "Green = correct letter & position, Yellow = correct letter, wrong position, White = not in word.";
  terminal.bold("\n" + msg1 + "\n");
  terminal(msg2 + "\n");
  terminal(msg3 + "\n\n");
  // Also log for testability
  console.log(msg1);
  console.log(msg2);
  console.log(msg3);
}

function chancesOver(word) {
  const msg1 = "No more chances! Game over.";
  const msg2 = word;
  terminal.bold.red("\n" + msg1 + "\n");
  terminal.red("The wordle was '%s'\n", word);
  // Also log for testability
  console.log(msg1);
  console.log(msg2);
}

module.exports = {
  explainGame,
  chancesOver,
};
