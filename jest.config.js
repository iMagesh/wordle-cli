// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  verbose: true,
  testEnvironment: "node",
  testTimeout: 10000,
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.js"],
};

module.exports = config;

// Or async function
// module.exports = async () => {
//   return {
//     verbose: true,
//   };
// };
