const axios = require("axios");

async function fetchWord() {
  let response;
  const alphabets = "abcdefghijklmnopqrstuvwxyz";
  const randomChar = alphabets[Math.floor(Math.random() * alphabets.length)];
  try {
    response = await axios.get(
      "https://api.datamuse.com/words?sp=" + randomChar + "????&max=15"
    );
  } catch (error) {
    console.log(error);
    console.log("Something went wrong. Try again in few minutes");
  }
  let random = response.data[Math.floor(Math.random() * response.data.length)];
  return random.word;
}

module.exports = {
  fetchWord,
};
