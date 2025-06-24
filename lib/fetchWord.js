const axios = require("axios");

async function fetchWord() {
  const alphabets = "abcdefghijklmnopqrstuvwxyz";
  const randomChar = alphabets[Math.floor(Math.random() * alphabets.length)];
  const url = `https://api.datamuse.com/words?sp=${randomChar}????&max=15`;
  try {
    const { data } = await axios.get(url);
    if (data.length > 0) {
      return data[Math.floor(Math.random() * data.length)].word;
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
