// Early mocks that need to be set up before any imports
// This file runs before setupFilesAfterEnv

// Set environment variable to prevent Expo runtime checks
process.env.EXPO_NO_DOTENV = "1";
process.env.NODE_ENV = "test";

// Mock Expo runtime to prevent import errors
const mockRegistry = {};
jest.mock("expo/src/winter/runtime.native", () => {
  const originalModule = jest.requireActual("expo/src/winter/runtime.native");
  return {
    __esModule: true,
    default: {
      ...originalModule.default,
      __ExpoImportMetaRegistry: mockRegistry,
    },
  };
}, { virtual: false });

// Mock Expo installGlobal
jest.mock("expo/src/winter/installGlobal", () => {
  return {
    __esModule: true,
    default: {},
    getValue: jest.fn(() => mockRegistry),
  };
}, { virtual: false });

// Mock Expo - use manual mock
jest.mock("expo");

// Mock expo-av early to prevent runtime errors
jest.mock("expo-av", () => ({
  Audio: {
    setAudioModeAsync: jest.fn(),
    Sound: {
      createAsync: jest.fn(),
    },
  },
}), { virtual: false });

