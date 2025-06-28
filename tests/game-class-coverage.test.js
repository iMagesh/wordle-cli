// Tests for Game class coverage and edge cases
const terminal = require("terminal-kit").terminal;

describe("Game class coverage", () => {
  let Game, data, game;
  beforeEach(() => {
    jest.resetModules();
    jest.spyOn(require("../lib/messages"), "explainGame").mockImplementation(() => {});
    jest.spyOn(require("../lib/fetchWord"), "fetchWord").mockResolvedValue("apple");
    jest.spyOn(require("../lib/table"), "buildRow").mockImplementation(() => {});
    Game = require("../lib/index").Game;
    data = require("../lib/index").data;
    game = new Game();
    game.word = "APPLE";
    game.wordArr = game.word.split("");
    data.guessedWords = [];
    data.elapsedChances = 0;
    data.totalChances = 6;
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("start calls explainGame, fetchWord, buildRow, and getInput", async () => {
    const getInputSpy = jest.spyOn(game, "getInput").mockResolvedValue();
    await game.start();
    expect(require("../lib/messages").explainGame).toHaveBeenCalled();
    expect(require("../lib/fetchWord").fetchWord).toHaveBeenCalled();
    expect(require("../lib/table").buildRow).toHaveBeenCalled();
    expect(getInputSpy).toHaveBeenCalled();
    getInputSpy.mockRestore();
  });

  test("checkWord exits on max chances", async () => {
    jest.resetModules();
    const buildSpy = jest.spyOn(require("../lib/table"), "buildRow").mockImplementation(() => {});
    const overSpy = jest.spyOn(require("../lib/messages"), "chancesOver").mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});
    const { Game, data } = require("../lib/index");
    const game = new Game();
    game.word = "APPLE";
    game.wordArr = game.word.split("");
    data.guessedWords = [];
    data.elapsedChances = data.totalChances;
    data.totalChances = 6;
    await game.checkWord("APPLE");
    expect(buildSpy).toHaveBeenCalled();
    expect(overSpy).toHaveBeenCalledWith("APPLE");
    expect(exitSpy).toHaveBeenCalled();
    buildSpy.mockRestore();
    overSpy.mockRestore();
    exitSpy.mockRestore();
  });

  test("checkWord exits on correct guess", async () => {
    const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});
    const buildSpy = jest.spyOn(require("../lib/table"), "buildRow").mockResolvedValue();
    game.word = "APPLE";
    await game.checkWord("APPLE");
    expect(exitSpy).toHaveBeenCalled();
    buildSpy.mockRestore();
    exitSpy.mockRestore();
  });

  test("checkWord with wrong length calls terminal.bold.red and getInput", async () => {
    const terminal = require("terminal-kit").terminal;
    const redSpy = jest.spyOn(terminal.bold, "red").mockImplementation(() => {});
    const { Game } = require("../lib/index");
    const game = new Game();
    game.word = "APPLE";
    game.wordArr = game.word.split("");
    const getInputSpy = jest.spyOn(game, "getInput").mockResolvedValue();
    await game.checkWord("APP");
    expect(redSpy).toHaveBeenCalledWith("\nIt should be a 5 letter word\n");
    expect(getInputSpy).toHaveBeenCalled();
    redSpy.mockRestore();
    getInputSpy.mockRestore();
  });

  test("checkWord after wrong guess calls getInput if chances remain", async () => {
    const getInputSpy = jest.spyOn(game, "getInput").mockResolvedValue();
    const storeSpy = jest.spyOn(game, "storeWord");
    const buildSpy = jest.spyOn(require("../lib/table"), "buildRow").mockResolvedValue();
    game.word = "APPLE";
    data.elapsedChances = 0;
    data.totalChances = 6;
    await game.checkWord("GRAPE");
    expect(storeSpy).toHaveBeenCalled();
    expect(buildSpy).toHaveBeenCalled();
    expect(getInputSpy).toHaveBeenCalled();
    storeSpy.mockRestore();
    buildSpy.mockRestore();
    getInputSpy.mockRestore();
  });

  test("checkWord after wrong guess with no chances left calls chancesOver and process.exit", async () => {
    jest.resetModules();
    const buildSpy = jest.spyOn(require("../lib/table"), "buildRow").mockResolvedValue();
    const overSpy = jest.spyOn(require("../lib/messages"), "chancesOver").mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});
    const { Game, data } = require("../lib/index");
    const game = new Game();
    game.word = "APPLE";
    game.wordArr = game.word.split("");
    data.guessedWords = [];
    data.elapsedChances = data.totalChances - 1;
    data.totalChances = 6;
    await game.checkWord("GRAPE");
    expect(buildSpy).toHaveBeenCalled();
    expect(overSpy).toHaveBeenCalledWith("APPLE");
    expect(exitSpy).toHaveBeenCalled();
    buildSpy.mockRestore();
    overSpy.mockRestore();
    exitSpy.mockRestore();
  });

  test("getInput with error calls terminal.error", async () => {
    const terminal = require("terminal-kit").terminal;
    const errorSpy = jest.spyOn(terminal, "error");
    let callbackCalled = false;
    terminal.inputField.mockImplementation(cb => {
      callbackCalled = true;
      cb("err", null);
    });
    const { Game } = require("../lib/index");
    const game = new Game();
    game.word = "APPLE";
    game.wordArr = game.word.split("");
    await game.getInput();
    expect(callbackCalled).toBe(true);
    expect(errorSpy).toHaveBeenCalledWith("err");
    errorSpy.mockRestore();
  });

  test("getInput with valid input calls checkWord", async () => {
    const terminal = require("terminal-kit").terminal;
    terminal.inputField.mockImplementation(cb => cb(null, "apple"));
    const { Game } = require("../lib/index");
    const game = new Game();
    game.word = "APPLE";
    game.wordArr = game.word.split("");
    const checkWordSpy = jest.spyOn(game, "checkWord").mockResolvedValue();
    await game.getInput();
    expect(checkWordSpy).toHaveBeenCalledWith("apple");
    checkWordSpy.mockRestore();
  });
});
