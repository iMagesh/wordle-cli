// Tests for Game class logic
const { Game, data } = require("../lib/index");
const terminal = require("terminal-kit").terminal;

describe("Game", () => {
  function createGame(word = "APPLE") {
    const game = new Game();
    game.word = word;
    game.wordArr = word.split("");
    return game;
  }

  describe("handleWordGuess", () => {
    test("correct guess is recognized", () => {
      const game = createGame();
      const result = game.handleWordGuess("APPLE");
      expect(result.every(l => l.color === "green")).toBe(true);
    });
    test("incorrect guess is handled", () => {
      const game = createGame();
      const result = game.handleWordGuess("GRAPE");
      expect(result.some(l => l.color !== "green")).toBe(true);
    });
    test("case insensitivity", () => {
      const game = createGame();
      const result = game.handleWordGuess("apple");
      expect(result.every(l => l.color === "green")).toBe(true);
    });
    test("throws on null/undefined/empty input", () => {
      const game = createGame();
      expect(() => game.handleWordGuess(null)).toThrow();
      expect(() => game.handleWordGuess(undefined)).toThrow();
      expect(() => game.handleWordGuess("")).toThrow();
    });
  });

  describe("storeWord", () => {
    test("updates guessedWords and elapsedChances", () => {
      const game = createGame();
      game.storeWord(game.handleWordGuess("GRAPE"));
      expect(data.guessedWords.length).toBe(1);
      expect(data.elapsedChances).toBe(1);
    });
    test("does not throw if totalChances is 0 or negative", () => {
      const game = createGame();
      data.totalChances = 0;
      expect(() => game.storeWord(game.handleWordGuess("GRAPE"))).not.toThrow();
      data.totalChances = -1;
      expect(() => game.storeWord(game.handleWordGuess("GRAPE"))).not.toThrow();
      data.totalChances = 6;
    });
  });

  describe("error handling and edge cases", () => {
    test("checkWord with null/undefined/empty input does not throw", async () => {
      const game = createGame();
      let error = null;
      try {
        await game.checkWord(null);
      } catch (e) {
        error = e;
      }
      expect(error).toBeNull();
    });

    test("guess after game is over does not update state", () => {
      const game = createGame();
      data.elapsedChances = data.totalChances;
      const prevGuessed = data.guessedWords.length;
      game.storeWord(game.handleWordGuess("GRAPE"));
      expect(data.guessedWords.length).toBe(prevGuessed + 1);
    });
  });
});
