// Manual mock for Expo runtime.native
// This prevents the Expo runtime from trying to require files that Jest blocks
const mockRegistry = {};

// Export a default object that matches what the real module exports
const mockRuntime = {
  __ExpoImportMetaRegistry: mockRegistry,
};

export default mockRuntime;

