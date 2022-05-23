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

async function checkWord(wordGuess) {
  let correctLetters = [];
  let correctLettersPos = [];
  console.log(correctLetters);
  wordGuess = wordGuess.toUpperCase();
  if (wordGuess.length !== 5) {
    terminal.bold.red("\nIt should be a 5 letter word\n");
    await getWord();
  } else if (wordGuess === word) {
    terminal.bold.green("\nExcellent! You guessed the word!\n");
    process.exit();
  } else {
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

    if (correctLettersPos.length > 0) {
      terminal.green("\nCorrect letters positions: %s\n", correctLettersPos);
    }

    if (correctLetters?.length === 5) {
      terminal.bold.green("\nBingo! You guessed the word!\n");
      terminal.green("\nThe wordle was '%s'\n", wordGuess);
    }

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
