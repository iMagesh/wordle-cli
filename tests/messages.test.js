// Tests for user-facing output in messages.js
const { explainGame, chancesOver } = require("../lib/messages");

describe("User-facing output", () => {
  let originalLog;
  beforeAll(() => {
    originalLog = console.log;
    console.log = jest.fn();
  });
  afterAll(() => {
    console.log = originalLog;
  });

  test("explainGame outputs welcome message", () => {
    explainGame();
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining("Welcome to Wordle CLI!"));
  });

  test("chancesOver outputs game over message and word", () => {
    chancesOver("APPLE");
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining("No more chances! Game over."));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining("APPLE"));
  });
});
