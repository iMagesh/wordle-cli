// Global test setup for terminal-kit and axios mocks
jest.mock('terminal-kit', () => ({
  terminal: Object.assign(jest.fn(), {
    bold: Object.assign(jest.fn((...args) => args[0]), {
      red: jest.fn(),
      green: jest.fn(),
    }),
    red: jest.fn(),
    green: jest.fn(),
    error: jest.fn(),
    inputField: jest.fn(),
  })
}));

jest.mock('axios');
const axios = require('axios');
axios.get.mockResolvedValue({ data: [] });
