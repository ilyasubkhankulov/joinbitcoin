module.exports = {
    clearMocks: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: [
      "<rootDir>/src"
    ],
    testMatch: [
      "**/__tests__/**/*.+(ts|tsx|js)",
      "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
    collectCoverage: true,
    coverageThreshold: {
      "global": {
        "branches": 70,
        "functions": 40,
        "lines": 70,
        "statements": -20
      }
    },
    globals: {
      "ts-jest": {
        "tsConfig": "tsconfig.json"
      }
    },
    "preset": "ts-jest",
    "moduleFileExtensions": [
      "ts",
      "tsx",
      "js"
    ],
  }
 