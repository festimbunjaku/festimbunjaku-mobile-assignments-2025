// Matchers are now built into @testing-library/react-native

// Mock Expo runtime to prevent import errors
jest.mock("expo", () => ({
  __esModule: true,
  default: {},
}));

// Mock Expo winter runtime
jest.mock("expo/src/winter/runtime.native", () => ({
  __esModule: true,
  default: {},
}));

// Mock Expo installGlobal
jest.mock("expo/src/winter/installGlobal", () => ({
  __esModule: true,
  default: {},
  getValue: jest.fn(() => ({})),
}));

// Mock React Native TurboModuleRegistry
jest.mock("react-native/Libraries/TurboModule/TurboModuleRegistry", () => ({
  get: jest.fn(() => ({
    show: jest.fn(),
    reload: jest.fn(),
  })),
  getEnforcing: jest.fn(() => ({
    show: jest.fn(),
    reload: jest.fn(),
  })),
}));

// Mock React Native Feature Flags
jest.mock("react-native/src/private/featureflags/specs/NativeReactNativeFeatureFlags", () => ({
  __esModule: true,
  default: {
    commonTestFlag: false,
  },
}));

// Mock NativeDeviceInfo
jest.mock("react-native/src/private/specs_DEPRECATED/modules/NativeDeviceInfo", () => {
  const dimensions = {
    window: {
      width: 375,
      height: 812,
      scale: 2,
      fontScale: 1,
    },
    screen: {
      width: 375,
      height: 812,
      scale: 2,
      fontScale: 1,
    },
  };
  
  const constants = {
    Dimensions: dimensions,
    windowPhysicalPixels: {
      width: 375,
      height: 812,
      scale: 2,
      fontScale: 1,
    },
    screenPhysicalPixels: {
      width: 375,
      height: 812,
      scale: 2,
      fontScale: 1,
    },
    window: dimensions.window,
    screen: dimensions.screen,
  };
  
  const mockModule = {
    getConstants: jest.fn(() => constants),
  };
  
  return {
    __esModule: true,
    default: mockModule,
  };
});

// Mock React Native DevMenu
jest.mock("react-native/src/private/devsupport/devmenu/specs/NativeDevMenu", () => ({
  __esModule: true,
  default: {
    show: jest.fn(),
    reload: jest.fn(),
  },
}));

// Mock NativePlatformConstantsIOS (deprecated module)
jest.mock("react-native/src/private/specs_DEPRECATED/modules/NativePlatformConstantsIOS", () => ({
  __esModule: true,
  default: {
    getConstants: jest.fn(() => ({
      interfaceIdiom: "phone",
      isTesting: true,
      isDisableAnimations: false,
    })),
  },
}));

// Mock Platform constants
jest.mock("react-native/Libraries/Utilities/Platform", () => {
  const Platform = jest.requireActual("react-native/Libraries/Utilities/Platform");
  return {
    ...Platform,
    OS: "ios",
    Version: 14,
    select: jest.fn((obj) => obj.ios || obj.default),
  };
});

// Mock react-native-svg
jest.mock("react-native-svg", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: ({ children, ...props }: any) => React.createElement(View, props, children),
    Svg: ({ children, ...props }: any) => React.createElement(View, props, children),
    Circle: (props: any) => React.createElement(View, props),
    Path: (props: any) => React.createElement(View, props),
    G: ({ children, ...props }: any) => React.createElement(View, props, children),
  };
});

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Mock Expo modules
jest.mock("expo-av", () => ({
  Audio: {
    setAudioModeAsync: jest.fn(),
    Sound: {
      createAsync: jest.fn(),
    },
  },
}));

// Mock sound file requires to prevent module load errors
jest.mock("../src/assets/sounds/alarm.mp3", () => "mock-sound-file", { virtual: true });

jest.mock("expo-font", () => ({
  loadAsync: jest.fn(),
  Font: {
    isLoaded: jest.fn(() => Promise.resolve(true)),
    displayName: "Font",
  },
}));

// Mock @expo/vector-icons to prevent Font.isLoaded errors
jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    MaterialIcons: ({ name, size, color, ...props }: any) =>
      React.createElement(Text, { ...props, testID: `icon-${name}` }, name),
    Ionicons: ({ name, size, color, ...props }: any) =>
      React.createElement(Text, { ...props, testID: `icon-${name}` }, name),
    FontAwesome: ({ name, size, color, ...props }: any) =>
      React.createElement(Text, { ...props, testID: `icon-${name}` }, name),
  };
});

jest.mock("expo-background-fetch", () => ({
  registerTaskAsync: jest.fn(),
  unregisterTaskAsync: jest.fn(),
  BackgroundFetchResult: {
    NoData: "NoData",
    NewData: "NewData",
    Failed: "Failed",
  },
}));

jest.mock("expo-task-manager", () => ({
  defineTask: jest.fn(),
}));

// Mock expo-file-system
jest.mock("expo-file-system/legacy", () => ({
  EncodingType: {
    UTF8: "utf8",
    Base64: "base64",
  },
  readAsStringAsync: jest.fn(() => Promise.resolve("mock-file-content")),
  getInfoAsync: jest.fn(() =>
    Promise.resolve({
      exists: true,
      size: 1024,
      uri: "file://mock-uri",
    })
  ),
  writeAsStringAsync: jest.fn(() => Promise.resolve()),
  deleteAsync: jest.fn(() => Promise.resolve()),
  makeDirectoryAsync: jest.fn(() => Promise.resolve()),
  readDirectoryAsync: jest.fn(() => Promise.resolve([])),
}));

// Mock Supabase
jest.mock("./src/services/supabase", () => ({
  supabase: {
    auth: {
      getSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
      signUp: jest.fn(() => Promise.resolve({ data: { user: null, session: null }, error: null })),
      signInWithPassword: jest.fn(() => Promise.resolve({ data: { user: null, session: null }, error: null })),
      signOut: jest.fn(() => Promise.resolve({ error: null })),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: null, error: null })),
          })),
        })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  },
}));

