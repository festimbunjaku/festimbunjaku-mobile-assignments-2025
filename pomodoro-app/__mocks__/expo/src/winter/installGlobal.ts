// Manual mock for Expo installGlobal
const mockRegistry = {};

export default {};

export function installGlobal(name: string, getValue: () => any): void {
  // Mock implementation - do nothing
}

export function getValue() {
  return mockRegistry;
}

