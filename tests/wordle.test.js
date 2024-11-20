const { fetchWord } = require("../lib/fetchWord");
const { data, checkWord } = require("../lib/index");

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

describe("check word", () => {
  beforeAll(async () => {
    word = await fetchWord();
  });

  test("word should not contain anything except alphabets", () => {
    expect(word).toMatch(/^[a-zA-Z]+$/);
  });

  test("guessed word should match the right word", () => {
    // expect(checkWord(word)).toBe(true);
  });
});

describe("there should not be any repeat words", () => {
  beforeAll(async () => {
    words = [];
    for (let i = 0; i < 10; i++) {
      let randWord = await fetchWord();
      words.push(randWord);
    }
  });
  test("word should not be repeated", async () => {
    expect(new Set(words).size).toBe(words.length);
  });
});
