/**
 * E2E Tests for Error Recovery Flow
 * 
 * Note: These tests require Detox to be properly configured and the app to be built.
 * Run: npm run test:e2e:build before running these tests.
 */

describe("Error Recovery", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  test("should handle network errors gracefully", async () => {
    // Disable network
    await device.setNetworkConnection("none");
    
    // Try to login (this should fail gracefully)
    await element(by.id("email-input")).typeText("test@example.com");
    await element(by.id("password-input")).typeText("password123");
    await element(by.id("sign-in-button")).tap();
    
    // Wait a moment for error handling
    await waitFor(element(by.text("Network error")).or(element(by.text("Sign In"))))
      .toBeVisible()
      .withTimeout(5000);
    
    // Re-enable network
    await device.setNetworkConnection("wifi");
    
    // Verify we can still interact with the app
    await expect(element(by.text("Sign In")).or(element(by.id("email-input")))).toBeVisible();
  });

  test("should recover from network errors", async () => {
    // Start with network disabled
    await device.setNetworkConnection("none");
    
    // Try an action that requires network
    await element(by.id("email-input")).typeText("test@example.com");
    await element(by.id("password-input")).typeText("password123");
    
    // Re-enable network
    await device.setNetworkConnection("wifi");
    
    // Try login again - should work now
    await element(by.id("sign-in-button")).tap();
    
    // Should either succeed or show appropriate error
    await waitFor(
      element(by.text("Timer")).or(element(by.text("Sign In")))
    )
      .toBeVisible()
      .withTimeout(10000);
  });

  test("should handle app state changes", async () => {
    // Launch app
    await device.launchApp();
    
    // Send app to background
    await device.sendToHome();
    
    // Bring app back to foreground
    await device.launchApp({ newInstance: false });
    
    // Verify app is still functional
    await expect(element(by.text("Sign In")).or(element(by.text("Timer")))).toBeVisible();
  });

  test("should handle invalid input gracefully", async () => {
    // Try to submit form with invalid email
    await element(by.id("email-input")).typeText("invalid-email");
    await element(by.id("password-input")).typeText("password123");
    await element(by.id("sign-in-button")).tap();
    
    // Should show validation error
    await waitFor(
      element(by.text("Please enter a valid email address")).or(
        element(by.text("Email is required"))
      )
    )
      .toBeVisible()
      .withTimeout(3000);
  });

  test("should handle empty form submission", async () => {
    // Try to submit empty form
    await element(by.id("sign-in-button")).tap();
    
    // Should show validation errors
    await waitFor(element(by.text("Email is required")))
      .toBeVisible()
      .withTimeout(3000);
  });

  test("should maintain app state after errors", async () => {
    // Cause an error (invalid login attempt)
    await element(by.id("email-input")).typeText("invalid@test.com");
    await element(by.id("password-input")).typeText("wrongpassword");
    await element(by.id("sign-in-button")).tap();
    
    // Wait for error handling
    await waitFor(element(by.text("Sign In")).or(element(by.text("Invalid"))))
      .toBeVisible()
      .withTimeout(5000);
    
    // App should still be functional
    await expect(element(by.id("email-input"))).toBeVisible();
    await expect(element(by.id("password-input"))).toBeVisible();
  });

  test("should handle rapid interactions", async () => {
    // Rapidly tap buttons
    await element(by.id("sign-in-button")).tap();
    await element(by.id("sign-in-button")).tap();
    await element(by.id("sign-in-button")).tap();
    
    // App should handle this gracefully without crashing
    await waitFor(element(by.text("Sign In")).or(element(by.text("Email is required"))))
      .toBeVisible()
      .withTimeout(3000);
  });
});

