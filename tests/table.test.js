// Tests for table rendering and color logic
const chalk = require("chalk");
const { buildRow, data } = require("../lib/table");
const { Game } = require("../lib/index");

describe("Table rendering and color logic", () => {
  test("after multiple guesses, rows are filled and letters have correct colors", () => {
    const game = new Game();
    game.word = "APPLE";
    game.wordArr = game.word.split("");
    data.guessedWords = [];
    data.elapsedChances = 0;
    data.totalChances = 6;

    // First guess: GRAPE
    const guess1 = game.handleWordGuess("GRAPE");
    game.storeWord(guess1);
    // Second guess: APPLE
    const guess2 = game.handleWordGuess("APPLE");
    game.storeWord(guess2);

    // Check guessedWords content
    expect(data.guessedWords.length).toBe(2);
    const row1 = data.guessedWords[0];
    const row2 = data.guessedWords[1];
    row2.forEach((cell, i) => {
      expect(cell).toBe(chalk.green.bold("APPLE"[i]));
    });
    expect(row1[0]).toBe(chalk.white.bold("G"));
    expect(row1[1]).toBe(chalk.white.bold("R"));
    expect(row1[2]).toBe(chalk.yellow.bold("A"));
    expect(row1[3]).toBe(chalk.yellow.bold("P"));
    expect(row1[4]).toBe(chalk.green.bold("E"));

    // Optionally, check buildRow output (table rendering)
    console.log = jest.fn();
    buildRow();
    const tableOutput = console.log.mock.calls.map(call => call[0]).find(str => typeof str === 'string' && str.includes("│"));
    expect(tableOutput).toContain("G");
    expect(tableOutput).toContain("A");
    expect(tableOutput).toContain("P");
    expect(tableOutput).toContain("L");
    expect(tableOutput).toContain("E");
  });
});
