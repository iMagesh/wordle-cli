const axios = require("axios");
const terminal = require("terminal-kit").terminal;
const { table } = require("table");
const chalk = require("chalk");
const _ = require("lodash");

let word = "";
let wordArr = [];
const data = {
  totalChances: 6,
  elapsedChances: 0,
  guessedWords: [],
};

function explainGame() {
  terminal("Guess the WORDLE in six tries\n");
  terminal(
    "Each guess must be a valid five-letter word. \nHit the enter button to submit.\n"
  );
  terminal(
    "After each guess, the color of the tiles will change to show how close your guess was to the word.\n"
  );
}

async function startGame() {
  // word = await fetchWord();
  word = "issue";
  word = word.toUpperCase();
  // console.log(word);
  wordArr = word.split("");
  buildRow();
  getInput();
}

// Calls the methods only when run through command line
if (require.main === module) {
  explainGame();
  startGame();
}

async function buildRow() {
  const defaultMatrix = [
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
  ];
  const emptyRow = [" ", " ", " ", " ", " "];
  let matrix = [];
  if (data.guessedWords.length === 0) {
    matrix = defaultMatrix;
  } else {
    for await (const guessedWord of data.guessedWords) {
      matrix.push(guessedWord);
    }
    if (
      data.guessedWords.length > 0 &&
      data.guessedWords.length < data.totalChances
    ) {
      let num = data.totalChances - data.guessedWords.length;
      for (let i = 0; i < num; i++) {
        matrix.push(emptyRow);
      }
    }
  }
  return drawTable(matrix);
}

function drawTable(tableData) {
  // console.log(tableData);
  console.log("\n");
  console.log(table(tableData));
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

function storeWord(wordGuess) {
  data.elapsedChances = data.elapsedChances + 1;
  if (!data.guessedWords.includes(wordGuess)) {
    data.guessedWords.push(wordGuess);
  }
}

function chancesOver() {
  terminal.red("\nSorry you had only " + data.totalChances + " chances");
  terminal.red("\nYou lost! The word was " + word);
}

async function checkWord(wordGuess) {
  wordGuess = wordGuess.toUpperCase();
  if (data.elapsedChances === data.totalChances) {
    buildRow();
    chancesOver();
    return process.exit();
  } else if (wordGuess.length !== 5) {
    terminal.bold.red("\nIt should be a 5 letter word\n");
    await getInput();
  } else if (wordGuess === word) {
    storeWord(wordGuess);
    buildRow();
    terminal.bold.green("\nBingo! You guessed the word!\n");
    terminal.green("\nThe wordle was '%s'\n", wordGuess);
    process.exit();
  } else {
    // storeWord(wordGuess);
    const guessWord = await handleWordGuess(wordGuess);
    addToDataGuessWords(guessWord);
    buildRow();
    // console.log(guessWord);
    // await handleWrongGuess(correctLetters, correctLettersPos);
    await handleWrongGuess();
  }
  process.exit();
}

async function handleWordGuess(wordGuess) {
  const guessWord = [];
  let correctLetters = [];
  let correctLettersPos = [];
  wordGuess.split("").forEach((letter, index) => {
    let combine = [...correctLetters, ...correctLettersPos];
    if (wordArr.includes(letter)) {
      if (wordArr[index] === letter) {
        correctLettersPos.push(letter);
        guessWord.push({
          letter: letter,
          position: index,
          color: "green",
        });
      } else {
        if (_.countBy(combine)[letter] !== _.countBy(wordArr)[letter]) {
          correctLetters.push(letter);
          guessWord.push({
            letter: letter,
            position: index,
            color: "yellow",
          });
        } else {
          guessWord.push({
            letter: letter,
            position: index,
            color: "white",
          });
        }
      }
    } else {
      guessWord.push({
        letter: letter,
        position: index,
        color: "white",
      });
    }
  });

  return guessWord;
}

function addToDataGuessWords(guessWord) {
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
      return coloredWord.push(chalk.green(l.letter));
    } else if (
      l.color === "yellow" &&
      (!greens.includes(l.letter) ||
        letterOccurencesInWord[l.letter] > countGreenLetters[l.letter])
    ) {
      return coloredWord.push(chalk.yellow(l.letter));
    } else {
      return coloredWord.push(chalk.white(l.letter));
    }
  });
  // console.log("coloredWord", coloredWord);
  // data.guessedWords.push(coloredWord);
  data.elapsedChances = data.elapsedChances + 1;
  if (!data.guessedWords.includes(coloredWord)) {
    data.guessedWords.push(coloredWord);
  }
}

async function handleWrongGuess() {
  if (data.elapsedChances !== data.totalChances) {
    await getInput();
  } else {
    chancesOver();
  }
}

async function fetchWord() {
  let response;
  try {
    response = await axios.get(
      "https://api.datamuse.com/words?sp=?????&max=15"
    );
  } catch (error) {
    console.log(error);
    console.log("Something went wrong. Try again in few minutes");
  }
  let random = response.data[Math.floor(Math.random() * response.data.length)];
  return random.word;
}

module.exports = {
  data,
  explainGame,
  startGame,
  buildRow,
  drawTable,
  getInput,
  checkWord,
  storeWord,
  chancesOver,
  handleWordGuess,
  handleWrongGuess,
  fetchWord,
};
