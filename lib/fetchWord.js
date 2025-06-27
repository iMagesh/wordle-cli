const axios = require("axios");

async function fetchWord() {
  const alphabets = "abcdefghijklmnopqrstuvwxyz";
  const randomChar = alphabets[Math.floor(Math.random() * alphabets.length)];
  const url = `https://api.datamuse.com/words?sp=${randomChar}????&max=15`;
  try {
    const { data } = await axios.get(url);
    if (Array.isArray(data) && data.length > 0) {
      // Filter for valid 5-letter alphabetic words
      const validWords = data
        .map(w => w.word)
        .filter(word => typeof word === 'string' && word.length === 5 && /^[a-zA-Z]+$/.test(word));
      if (validWords.length > 0) {
        return validWords[Math.floor(Math.random() * validWords.length)].toLowerCase();
      }
    }
  } catch (error) {
    console.log(error);
    console.log("Something went wrong. Try again in few minutes");
  }
  return "apple"; // Fallback word
}

module.exports = {
  fetchWord,
};
