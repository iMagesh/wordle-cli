// Integration tests for full game scenarios
const { Game, data } = require("../lib/index");

describe("Integration: simulate a full game", () => {
  beforeEach(() => {
    data.guessedWords = [];
    data.elapsedChances = 0;
    data.totalChances = 6;
  });
  function createGame(word = "APPLE") {
    const game = new Game();
    game.word = word;
    game.wordArr = word.split("");
    return game;
  }

  test("simulate losing game", () => {
    const game = createGame();
    for (let i = 0; i < data.totalChances; i++) {
      game.storeWord(game.handleWordGuess("GRAPE"));
    }
    expect(data.guessedWords.length).toBe(data.totalChances);
    expect(data.guessedWords[data.totalChances - 1].join("")).toContain("G");
  });

  test("simulate winning game", () => {
    const game = createGame();
    game.storeWord(game.handleWordGuess("APPLE"));
    expect(data.guessedWords[0].join("")).toContain("A");
    expect(data.guessedWords.length).toBe(1);
  });
});
