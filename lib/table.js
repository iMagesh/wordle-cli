const { table } = require("table");

const data = {
  totalChances: 6,
  elapsedChances: 0,
  guessedWords: [],
};

function buildRow() {
  const emptyRow = [" ", " ", " ", " ", " "];
  const matrix = [
    ...data.guessedWords,
    ...Array(data.totalChances - data.guessedWords.length).fill(emptyRow),
  ];
  // Inline drawTable
  console.log("\n");
  console.log(table(matrix));
}

module.exports = {
  buildRow,
  data,
};
