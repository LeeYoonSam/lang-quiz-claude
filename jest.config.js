const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "node",
  testTimeout: 30000,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: [
    "**/__tests__/**/*.test.ts",
    "**/__tests__/**/*.test.tsx",
    "**/*.test.ts",
    "**/*.test.tsx",
  ],
  maxWorkers: 1,
  collectCoverageFrom: [
    "app/**/*.{js,jsx,ts,tsx}",
    "components/**/*.{js,jsx,ts,tsx}",
    "lib/**/*.{js,jsx,ts,tsx}",
    "hooks/**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/coverage/**",
    "!**/dist/**",
  ],
  coverageThreshold: {
    "app/api/**": {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
