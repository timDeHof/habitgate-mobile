// Mock native modules for Jest testing
jest.mock("react-native-mmkv", () => ({
  createMMKV: jest.fn(() => ({
    set: jest.fn(),
    getString: jest.fn(),
    getAllKeys: jest.fn(),
    remove: jest.fn(),
    clearAll: jest.fn(),
    // Add other MMKV methods as needed for flexibility
  })),
}));

// Mock react-native-nitro-modules
jest.mock("react-native-nitro-modules", () => ({
  NitroModules: {
    createTurboModule: jest.fn(),
    createHybridObject: jest.fn(),
  },
}));

// Mock other native modules that might be imported
jest.mock("react-native-worklets", () => ({
  useWorklet: jest.fn(),
  useSharedValue: jest.fn((initialValue = 0) => ({ value: initialValue })),
}));

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
}));

jest.mock("expo-image", () => ({
  Image: jest.fn(),
}));

jest.mock("expo-linear-gradient", () => ({
  LinearGradient: jest.fn(({ children }) => children),
}));

// Mock uuid (ESM module that doesn't work with Jest by default)
jest.mock("uuid", () => ({
  v4: jest.fn(() => "test-uuid-v4-mock"),
}));
