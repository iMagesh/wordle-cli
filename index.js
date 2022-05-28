const axios = require("axios");
const terminal = require("terminal-kit").terminal;
const _ = require("lodash");

let word = "";
let wordArr = [];
const data = {
  totalChances: 6,
  elapsedChances: 0,
  guessedWords: [],
};

terminal("Guess the WORDLE in six tries\n");
terminal(
  "Each guess must be a valid five-letter word. Hit the enter button to submit.\n"
);
terminal(
  "After each guess, the color of the tiles will change to show how close your guess was to the word.\n"
);

async function gWord() {
  word = await fetchWord();
  // word = "titty";
  word = word.toUpperCase();
  // console.log(word);
  wordArr = word.split("");
  buildRow();
  getInput();
}
gWord();

function buildRow() {
  const defaultMatrix = [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ];
  const emptyRow = ["", "", "", "", ""];
  let matrix = [];
  if (data.guessedWords.length === 0) {
    matrix = defaultMatrix;
  } else {
    data.guessedWords.forEach((guessedWord) => {
      matrix.push(guessedWord.split(""));
    });
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
  console.log("\n");
  return terminal.table(tableData, {
    hasBorder: true,
    contentHasMarkup: true,
    borderChars: "lightRounded",
    borderAttr: { color: "grey" },
    textAttr: { bgColor: "default" },
    width: 30,
    fit: true, // Activate all expand/shrink + wordWrap
  });
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
    storeWord(wordGuess);
    buildRow();
    await handleWordGuess(wordGuess);
  }
  process.exit();
}

async function handleWordGuess(wordGuess) {
  let correctLetters = [];
  let correctLettersPos = [];
  wordGuess.split("").forEach((letter, index) => {
    let combine = [...correctLetters, ...correctLettersPos];
    if (wordArr.includes(letter)) {
      if (wordArr[index] === letter) {
        correctLettersPos.push(letter);
      } else {
        if (_.countBy(combine)[letter] !== _.countBy(wordArr)[letter]) {
          correctLetters.push(letter);
        }
      }
    }
  });

  const countOccurences = _.countBy(correctLettersPos);
  const letterOccurencesInWord = _.countBy(wordArr);

  correctLetters = correctLetters.filter((letter) => {
    if (
      !correctLettersPos.includes(letter) ||
      letterOccurencesInWord[letter] > countOccurences[letter]
    ) {
      return letter;
    }
  });
  await handleWrongGuess(correctLetters, correctLettersPos);
}

async function handleWrongGuess(correctLetters, correctLettersPos) {
  if (correctLetters?.length !== 5) {
    terminal.bold.red("\nWrong guess!\n");
    console.log("\nCorrect Position", correctLettersPos);
    console.log("\nCorrect but not in position", correctLetters);
    if (data.elapsedChances !== data.totalChances) {
      await getInput();
    } else {
      chancesOver();
    }
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
