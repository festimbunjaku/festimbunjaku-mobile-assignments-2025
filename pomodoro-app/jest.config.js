module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|date-fns|@ungap)",
  ],
  resolver: undefined,
  setupFiles: ["<rootDir>/jest.setup.early.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{ts,tsx}",
    "!src/**/__tests__/**",
    "!src/**/__mocks__/**",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  moduleNameMapper: {
    "^expo/src/winter/runtime\\.native$": "<rootDir>/__mocks__/expo/src/winter/runtime.native.ts",
    "^expo/src/winter/installGlobal$": "<rootDir>/__mocks__/expo/src/winter/installGlobal.ts",
    "\\.(mp3|wav|m4a|aac|ogg)$": "<rootDir>/__mocks__/soundFile.js",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

