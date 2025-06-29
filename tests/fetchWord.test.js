// Tests for fetchWord logic
const axios = require('axios');
jest.mock('axios');
const { fetchWord } = require("../lib/fetchWord");
const fs = require("fs");
const path = require("path");
const wordsPath = path.join(__dirname, "../lib/words.json");
const localWords = JSON.parse(fs.readFileSync(wordsPath, "utf8"));

describe("fetchWord", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: [] });
  });

  test("returns a five-letter word", async () => {
    axios.get.mockResolvedValue({ data: [{ word: "apple" }] });
    const word = await fetchWord();
    expect(word).toBeDefined();
    expect(word.length).toBe(5);
    expect(word).toMatch(/^[a-zA-Z]+$/);
  });

  test("returns unique words in multiple calls", async () => {
    const uniqueWords = [
      { word: "apple" }, { word: "grape" }, { word: "peach" }, { word: "mango" }, { word: "lemon" },
      { word: "berry" }, { word: "melon" }, { word: "plums" }, { word: "guava" }, { word: "olive" }
    ];
    let call = 0;
    axios.get.mockImplementation(() => {
      const idx = call % uniqueWords.length;
      call++;
      return Promise.resolve({ data: [uniqueWords[idx]] });
    });
    const words = await Promise.all(Array.from({ length: 10 }, fetchWord));
    expect(new Set(words).size).toBe(words.length);
  });

  test("returns fallback word if API returns empty array", async () => {
    axios.get.mockResolvedValue({ data: [] });
    const word = await fetchWord();
    expect(localWords).toContain(word);
  });

  test("returns fallback word if API throws error", async () => {
    axios.get.mockImplementation(() => { throw new Error("fail"); });
    const word = await fetchWord();
    expect(localWords).toContain(word);
  });

  test("logs error and fallback message if axios throws", async () => {
    axios.get.mockImplementation(() => { throw new Error("fail"); });
    const logSpy = jest.spyOn(console, "log");
    const word = await fetchWord();
    expect(localWords).toContain(word);
    expect(logSpy).toHaveBeenCalledWith(expect.any(Error));
    expect(logSpy).toHaveBeenCalledWith("Something went wrong. Try again in few minutes");
    logSpy.mockRestore();
  });

  test("returns fallback if API returns non-alphabetic word", async () => {
    axios.get.mockResolvedValue({ data: [{ word: "12345" }] });
    const word = await fetchWord();
    expect(word).toMatch(/^[a-zA-Z]+$/);
  });

  test("handles malformed API data (missing word property)", async () => {
    axios.get.mockResolvedValue({ data: [{ notword: "XXXXX" }] });
    const word = await fetchWord();
    expect(localWords).toContain(word);
  });

  test("returns a local fallback word if API fails and local list is present", async () => {
    axios.get.mockImplementation(() => { throw new Error("fail"); });
    // Remove apple from the local list to ensure randomness
    jest.resetModules();
    const fs = require("fs");
    const path = require("path");
    const wordsPath = path.join(__dirname, "../lib/words.json");
    const words = JSON.parse(fs.readFileSync(wordsPath, "utf8"));
    // Remove 'apple' if present
    const filtered = words.filter(w => w !== "apple");
    fs.writeFileSync(wordsPath, JSON.stringify(filtered));
    const { fetchWord } = require("../lib/fetchWord");
    const word = await fetchWord();
    expect(filtered).toContain(word);
    // Restore original list
    fs.writeFileSync(wordsPath, JSON.stringify(words));
  });
});
