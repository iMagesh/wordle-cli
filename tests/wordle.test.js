const { fetchWord } = require("../index");

describe("fetch word", () => {
  beforeAll(async () => {
    word = await fetchWord();
  });

  test("fetch a five letter word", async () => {
    expect(word.length).toBe(5);
  });

  test("word cannot be undefined or null or empty", () => {
    expect(word).not.toBe(undefined);
    expect(word).not.toBe(null);
    expect(word).not.toBe("");
  });
});
