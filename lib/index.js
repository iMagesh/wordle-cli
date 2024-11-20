const terminal = require("terminal-kit").terminal;
const chalk = require("chalk");
const _ = require("lodash");

const { buildRow, data } = require("./table");
const { chancesOver, explainGame } = require("./messages");
const { fetchWord } = require("./fetchWord");

let word = "";
let wordArr = [];
let guessWordInColor = [];

// Calls the methods only when run through command line
if (require.main === module) {
  startGame();
  getInput();
}

async function startGame() {
  explainGame();
  word = await fetchWord();
  // word = "issue";
  word = word.toUpperCase();
  console.log(word);
  wordArr = word.split("");
  buildRow();
}

async function getInput() {
  await terminal.inputField(function (error, wordGuess) {
    if (error) {
      terminal.error(error);
      return;
    }
    checkWord(wordGuess);
  }).promise;
}

async function checkWord(wordGuess) {
  wordGuess = wordGuess.toUpperCase();
  const guessWord = await handleWordGuess(wordGuess);
  if (wordGuess.length !== 5) {
    terminal.bold.red("\nIt should be a 5 letter word\n");
    await getInput();
  }
  if (data.elapsedChances === data.totalChances) {
    buildRow();
    chancesOver(word);
    return process.exit();
  }

  if (wordGuess === word) {
    await handleGameWon(guessWord, word);
  } else {
    storeWord(guessWord);
    await buildRow();
    await handleWrongGuess();
  }
  process.exit();
}

async function handleGameWon(guessWord, word) {
  storeWord(guessWord);
  await buildRow();
  terminal.bold.green("\nBingo! You guessed the word!\n");
  terminal.green("\nThe wordle was '%s'\n", word);
  process.exit();
}

function pushColorLetters(letter, index, color) {
  guessWordInColor.push({
    letter: letter,
    position: index,
    color: color,
  });
}

function handleWordGuess(wordGuess) {
  guessWordInColor = [];
  let correctLetters = [];
  let correctLettersPos = [];
  wordGuess.split("").forEach((letter, index) => {
    let combine = [...correctLetters, ...correctLettersPos];
    if (wordArr.includes(letter)) {
      if (wordArr[index] === letter) {
        correctLettersPos.push(letter);
        pushColorLetters(letter, index, "green");
      } else {
        if (_.countBy(combine)[letter] !== _.countBy(wordArr)[letter]) {
          correctLetters.push(letter);
          pushColorLetters(letter, index, "yellow");
        } else {
          pushColorLetters(letter, index, "white");
        }
      }
    } else {
      pushColorLetters(letter, index, "white");
    }
  });

  return guessWordInColor;
}

function storeWord(guessWord) {
  let coloredWord = [];
  let greens = guessWord.map((l) => {
    if (l.color === "green") {
      return l.letter;
    }
  });
  const countGreenLetters = _.countBy(greens);
  const letterOccurencesInWord = _.countBy(wordArr);
  guessWord.forEach((l) => {
    if (l.color === "green") {
      return coloredWord.push(chalk.green.bold(l.letter));
    } else if (
      l.color === "yellow" &&
      (!greens.includes(l.letter) ||
        letterOccurencesInWord[l.letter] > countGreenLetters[l.letter])
    ) {
      return coloredWord.push(chalk.yellow.bold(l.letter));
    } else {
      return coloredWord.push(chalk.white.bold(l.letter));
    }
  });

  data.elapsedChances = data.elapsedChances + 1;
  if (!data.guessedWords.includes(coloredWord)) {
    data.guessedWords.push(coloredWord);
  }
  return coloredWord;
}

async function handleWrongGuess() {
  if (data.elapsedChances !== data.totalChances) {
    await getInput();
  } else {
    chancesOver(word);
  }
}

module.exports = {
  data,
  getInput,
  checkWord,
  storeWord,
  handleWordGuess,
  handleWrongGuess,
};
