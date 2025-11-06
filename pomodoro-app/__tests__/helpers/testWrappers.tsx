import React from "react";
import { AuthProvider } from "../../src/context/AuthContext";
import { SettingsProvider } from "../../src/context/SettingsContext";
import { ThemeProvider } from "../../src/context/ThemeContext";

// Mock all providers for testing
export const AllProvidersWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </SettingsProvider>
    </AuthProvider>
  );
};

// Add a simple test to prevent Jest from complaining about empty test suite
describe("testWrappers", () => {
  test("AllProvidersWrapper is defined", () => {
    expect(AllProvidersWrapper).toBeDefined();
  });
});

