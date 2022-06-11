const { table } = require("table");

const data = {
  totalChances: 6,
  elapsedChances: 0,
  guessedWords: [],
};

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
  console.log("\n");
  console.log(table(tableData));
}

module.exports = {
  buildRow,
  data,
};
