const terminal = require("terminal-kit").terminal;
terminal("Guess the WORDLE in six tries\n");
terminal(
  "Each guess must be a valid five-letter word. Hit the enter button to submit.\n"
);
terminal(
  "After each guess, the color of the tiles will change to show how close your guess was to the word.\n"
);

const word = "LOVER";
const wordArr = word.split("");
const data = {
  totalChances: 6,
  elapsedChances: 0,
  guessedWords: [],
};

function buildRow() {
  let defaultMatrix = [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ];
  let emptyRow = ["", "", "", "", ""];
  let matrix = [];
  if (data.guessedWords.length === 0) {
    matrix = defaultMatrix;
  } else {
    data.guessedWords.forEach((word) => {
      matrix.push(word.split(""));
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

buildRow();
getWord();

async function getWord() {
  await terminal.inputField(function (error, wordGuess) {
    if (error) {
      terminal.error(error);
      console.log("error");
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
  let correctLetters = [];
  let correctLettersPos = [];

  wordGuess = wordGuess.toUpperCase();
  if (data.elapsedChances === data.totalChances) {
    buildRow();
    chancesOver();
    return process.exit();
  } else if (wordGuess.length !== 5) {
    terminal.bold.red("\nIt should be a 5 letter word\n");
    await getWord();
  } else if (wordGuess === word) {
    storeWord(wordGuess);
    buildRow();
    terminal.bold.green("\nBingo! You guessed the word!\n");
    terminal.green("\nThe wordle was '%s'\n", wordGuess);
    process.exit();
  } else {
    storeWord(wordGuess);
    buildRow();
    wordGuess.split("").forEach((letter, index) => {
      if (wordArr.includes(letter)) {
        if (wordArr[index] === letter) {
          correctLettersPos.push(letter);
        } else {
          correctLetters.push(letter);
        }
      }
    });

    if (correctLetters?.length !== 5) {
      terminal.bold.red("\nWrong guess!\n");
      console.log("\nCorrect Position", correctLettersPos);
      console.log("\nCorrect but not in position", correctLetters);
      if (data.elapsedChances !== data.totalChances) {
        await getWord();
      } else {
        chancesOver();
      }
    }
  }
  process.exit();
}
