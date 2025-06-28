# Test Suite Organization

The test suite is organized for clarity, maintainability, and high coverage. Each file targets a specific feature or module:

- **fetchWord.test.js**: Unit tests for the `fetchWord` function, including API success, fallback, error handling, and edge cases (e.g., non-alphabetic/malformed data).
- **game.test.js**: Unit tests for the `Game` class’s core logic, such as `handleWordGuess`, `storeWord`, and state changes. Also includes edge cases and error handling for these methods.
- **game-class-coverage.test.js**: Full method and branch coverage for the `Game` class. Tests integration of methods, side effects (like terminal output, process exit), and ensures all code paths are exercised.
- **table.test.js**: Tests for table rendering and color logic, ensuring guesses are displayed and colored correctly.
- **messages.test.js**: Tests for user-facing output functions, such as welcome and game-over messages.
- **integration.test.js**: Simulates full game scenarios (winning, losing) to ensure all components work together as expected.
- **setupTests.js**: Global Jest setup for mocks and shared configuration.

This structure follows best practices and makes the suite easy to maintain and extend.
