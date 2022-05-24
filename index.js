const { processScopeQueue } = require("nextgen-events");

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

function drawTable() {
  return terminal.table(
    [
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ],
    {
      hasBorder: true,
      contentHasMarkup: true,
      borderChars: "lightRounded",
      borderAttr: { color: "grey" },
      textAttr: { bgColor: "default" },
      // firstCellTextAttr: { bgColor: "blue" },
      // firstRowTextAttr: { bgColor: "yellow" },
      // firstColumnTextAttr: { bgColor: "red" },
      width: 30,
      fit: true, // Activate all expand/shrink + wordWrap
    }
  );
}

// let correctLetters = [];
// let correctLettersPos = [];
drawTable();
// let wordGuess = "";
let chancesRemaining = 6;

getWord();
// if (chancesRemaining !== 0 || wordGuess === word) {
//   wordGuess = getWord();
//   checkWord(wordGuess);
//   chancesRemaining = chancesRemaining - 1;
// }

async function getWord() {
  await terminal.inputField(function (error, wordGuess) {
    if (error) {
      terminal.error(error);
      console.log("error");
      return;
    }
    checkWord(wordGuess);
  }).promise;
  // return process.exit();
}

function storeWord(wordGuess) {
  data.elapsedChances = data.elapsedChances + 1;
  if (!data.guessedWords.includes(wordGuess)) {
    data.guessedWords.push(wordGuess);
  }
}

async function checkWord(wordGuess) {
  let correctLetters = [];
  let correctLettersPos = [];
  console.log(correctLetters);
  wordGuess = wordGuess.toUpperCase();
  if (data.elapsedChances === data.totalChances) {
    terminal.red("Sorry you had only " + data.totalChances + " chances");
    terminal.red("You lost! The word was " + word);
    return process.exit();
  } else if (wordGuess.length !== 5) {
    terminal.bold.red("\nIt should be a 5 letter word\n");
    await getWord();
  } else if (wordGuess === word) {
    storeWord(wordGuess);
    terminal.bold.green("\nBingo! You guessed the word!\n");
    terminal.green("\nThe wordle was '%s'\n", wordGuess);
    process.exit();
  } else {
    storeWord(wordGuess);
    wordGuess.split("").forEach((letter, index) => {
      console.log(letter);
      // console.log(word);
      if (wordArr.includes(letter)) {
        // console.log(letter);
        if (wordArr[index] === letter) {
          correctLettersPos.push(letter);
        } else {
          correctLetters.push(letter);
        }
      }
    });

    if (correctLetters?.length !== 5) {
      terminal.bold.red("\n Wrong guess!\n");
      console.log("Correct Position", correctLettersPos);
      console.log("Correct but not in position", correctLetters);
      await getWord();
    }

    // return wordGuess;
  }
  process.exit();
}
