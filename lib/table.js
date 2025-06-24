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
  drawTable(matrix);
}

function drawTable(tableData) {
  console.log("\n");
  console.log(table(tableData));
}

module.exports = {
  buildRow,
  data,
};
