# Wordle CLI Game

Wordle cli game is for the CLI enthusiasts. Using this code you can play the trending game Wordle from within your terminal console. I built this for fun.
Feel free to suggest improvements or add issues in the issues tab.

## Features

- Play Wordle in your terminal
- Random 5-letter word fetched from an online API
- Colored feedback for correct, misplaced, and incorrect letters
- Handles edge cases and errors gracefully
- Well-tested with comprehensive test coverage

## Requirements

- Node.js v14+ recommended
- Internet connection (for fetching random words)

## Instructions

Clone the code and then run the following command

```bash
cd wordle-cli
npm i
```

and then to play the game type the following command:

```bash
npm start
```

## Example Game Session

```
Welcome to Wordle CLI!
Guess the 5-letter word in 6 tries.
Green = correct letter & position, Yellow = correct letter, wrong position, White = not in word.

_ _ _ _ _
_ _ _ _ _
_ _ _ _ _
_ _ _ _ _
_ _ _ _ _
_ _ _ _ _
```

## Running Tests

For running the test cases, run

```bash
npm run test
```

The test suite covers core logic, edge cases, and user-facing output.

## Test Suite Organization

See [TESTING.md](./TESTING.md) for details on the test suite structure and what each test file covers.

## License

MIT
