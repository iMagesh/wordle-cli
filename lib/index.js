const terminal = require("terminal-kit").terminal;
const chalk = require("chalk");
const _ = require("lodash");

const { buildRow, data } = require("./table");
const { chancesOver, explainGame } = require("./messages");
const { fetchWord } = require("./fetchWord");

class Game {
  constructor() {
    this.word = "";
    this.wordArr = [];
    this.guessWordInColor = [];
  }

  async start() {
    explainGame();
    this.word = (await fetchWord()).toUpperCase();
    this.wordArr = this.word.split("");
    buildRow();
    await this.getInput();
  }

  async getInput() {
    terminal.inputField(async (error, wordGuess) => {
      if (error) {
        terminal.error(error);
        return;
      }
      await this.checkWord(wordGuess);
    });
  }

  async checkWord(wordGuess) {
    wordGuess = wordGuess.toUpperCase();
    if (wordGuess.length !== 5) {
      terminal.bold.red("\nIt should be a 5 letter word\n");
      await this.getInput();
      return;
    }

    if (data.elapsedChances === data.totalChances) {
      buildRow();
      chancesOver(this.word);
      process.exit();
      return;
    }

    const guessWord = this.handleWordGuess(wordGuess);

    if (wordGuess === this.word) {
      this.storeWord(guessWord);
      await buildRow();
      terminal.bold.green("\nBingo! You guessed the word!\n");
      terminal.green("\nThe wordle was '%s'\n", this.word);
      process.exit();
      return;
    } else {
      this.storeWord(guessWord);
      await buildRow();
      if (data.elapsedChances < data.totalChances) {
        await this.getInput();
      } else {
        chancesOver(this.word);
        process.exit();
      }
    }
  }

  handleWordGuess(wordGuess) {
    this.guessWordInColor = [];
    const wordArrCopy = [...this.wordArr];
    const guessArr = wordGuess.split("");
    // First pass: mark greens
    guessArr.forEach((letter, idx) => {
      if (letter === this.wordArr[idx]) {
        this.guessWordInColor.push({ letter, position: idx, color: "green" });
        wordArrCopy[idx] = null; // Mark as used
      } else {
        this.guessWordInColor.push(null); // Placeholder
      }
    });
    // Second pass: mark yellows and whites
    guessArr.forEach((letter, idx) => {
      if (this.guessWordInColor[idx]) return; // Already green
      const foundIdx = wordArrCopy.indexOf(letter);
      if (foundIdx !== -1) {
        this.guessWordInColor[idx] = { letter, position: idx, color: "yellow" };
        wordArrCopy[foundIdx] = null; // Mark as used
      } else {
        this.guessWordInColor[idx] = { letter, position: idx, color: "white" };
      }
    });
    return this.guessWordInColor;
  }

  storeWord(guessWord) {
    const coloredWord = guessWord.map((l) => {
      if (l.color === "green") return chalk.green.bold(l.letter);
      if (l.color === "yellow") return chalk.yellow.bold(l.letter);
      return chalk.white.bold(l.letter);
    });
    data.elapsedChances += 1;
    data.guessedWords.push(coloredWord);
    return coloredWord;
  }
}

// Only run if called from CLI
if (require.main === module) {
  new Game().start();
}

module.exports = {
  data,
  Game,
};
