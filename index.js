const terminal = require("terminal-kit").terminal;

console.log("Guess the WORDLE in six tries");
console.log(
  "Each guess must be a valid five-letter word. Hit the enter button to submit."
);
console.log(
  "After each guess, the color of the tiles will change to show how close your guess was to the word."
);

terminal.table(
  [
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
