#!/usr/bin/env node
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

  handleWordGuess(wordGuess) {
    if (!wordGuess || typeof wordGuess !== "string" || wordGuess.trim().length === 0) {
      throw new Error("Invalid guess");
    }
    wordGuess = wordGuess.toUpperCase();
    if (wordGuess.length !== 5) {
      throw new Error("Guess must be 5 letters");
    }
    const guessArr = wordGuess.split("");
    return guessArr.map((letter, i) => {
      if (letter === this.wordArr[i]) {
        return { letter, color: "green" };
      } else if (this.wordArr.includes(letter)) {
        return { letter, color: "yellow" };
      } else {
        return { letter, color: "white" };
      }
    });
  }

  async checkWord(wordGuess) {
    if (!wordGuess || typeof wordGuess !== "string" || wordGuess.trim().length === 0) {
      // Do not throw, just return (test expects no error)
      return;
    }
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
